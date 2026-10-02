import { ENV } from '../../config/env.js';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export class LlmUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LlmUnavailableError';
  }
}

/**
 * Send a prompt to Gemini and return the text response.
 * Role: explanation / plain-language summarisation ONLY.
 * Must never be used to make eligibility decisions.
 *
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
export const geminiChat = async (systemPrompt, userMessage) => {
  if (!ENV.GEMINI_API_KEY) {
    console.warn('[GeminiService] No API key — returning stub response');
    return '[STUB] Gemini response — add GEMINI_API_KEY to .env';
  }

  const url = `${GEMINI_BASE}/models/${ENV.GEMINI_CHAT_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] },
    ],
    generationConfig: { maxOutputTokens: 1024, temperature: 0.2 },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
};

const fetchWithRetry = async (url, options, maxRetries = 3) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    
    if (res.status === 429 || res.status >= 500) {
      attempt++;
      if (attempt === maxRetries) {
        return res; // Let the caller handle the final failure
      }
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      console.warn(`[GeminiService] Received ${res.status}. Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(r => setTimeout(r, delay));
    } else {
      return res; // Bad request, unauthorized, etc., don't retry
    }
  }
};

/**
 * Fallback to Groq if Gemini is rate limited or unavailable
 */
export const groqChat = async (systemPrompt, userMessage, jsonMode = false) => {
  if (!ENV.GROQ_API_KEY) throw new Error('Missing GROQ_API_KEY');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 1024,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
};

/**
 * Send a prompt to Gemini in strict mode. Automatically falls back to Groq
 * on 429, 503, or rate limits so the service never goes down.
 */
export const geminiChatStrict = async (systemPrompt, userMessage) => {
  // 1. Try Gemini
  if (ENV.GEMINI_API_KEY) {
    try {
      const url = `${GEMINI_BASE}/models/${ENV.GEMINI_CHAT_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;
      const body = {
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] },
        ],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.2 },
      };

      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }, 2);

      if (res && res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim() !== '') {
          return text;
        }
      }
    } catch (geminiErr) {
      console.warn('[GeminiService] Gemini call failed, trying Groq fallback:', geminiErr.message);
    }
  }

  // 2. High-speed Fallback to Groq
  if (ENV.GROQ_API_KEY) {
    try {
      console.log('[GeminiService] Activating Groq fallback LLM...');
      const groqText = await groqChat(systemPrompt, userMessage);
      if (groqText && groqText.trim() !== '') {
        return groqText;
      }
    } catch (groqErr) {
      console.error('[GeminiService] Groq fallback also failed:', groqErr.message);
    }
  }

  throw new LlmUnavailableError('LLM service temporarily unavailable. Please retry in a few moments.');
};

/**
 * Generate an embedding vector for the given text.
 * Used by EmbeddingService — do not call directly from controllers.
 *
 * @param {string} text
 * @param {string} taskType - 'RETRIEVAL_DOCUMENT' or 'RETRIEVAL_QUERY'
 * @returns {Promise<number[]>}
 */
export const geminiEmbed = async (text, taskType = 'RETRIEVAL_DOCUMENT') => {
  if (!ENV.GEMINI_API_KEY) {
    console.warn('[GeminiService] No API key — returning zero embedding stub (256-dim)');
    return new Array(256).fill(0);
  }

  const url = `${GEMINI_BASE}/models/${ENV.GEMINI_EMBED_MODEL}:embedContent?key=${ENV.GEMINI_API_KEY}`;

  const body = {
    model: `models/${ENV.GEMINI_EMBED_MODEL}`,
    content: { parts: [{ text }] },
    taskType,
    outputDimensionality: 256,
  };

  const res = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Embed error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data?.embedding?.values ?? [];
};
/**
 * Send a prompt along with a file (PDF or Image) to Gemini for multimodal analysis.
 * Uses inlineData. Gemini 1.5 Flash natively supports application/pdf, image/jpeg, etc.
 */
export const geminiAnalyzeFile = async (systemPrompt, userMessage, fileBuffer, mimeType) => {
  // If file is text or plain text, pass directly as prompt text without Vision API
  if (mimeType && (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('plain'))) {
    const textContent = fileBuffer.toString('utf-8');
    const userPrompt = `${userMessage}\n\nExtracted Document Content:\n${textContent.slice(0, 10000)}`;
    return await geminiChatStrict(systemPrompt + '\nRespond with ONLY valid JSON.', userPrompt);
  }

  // 1. Try Gemini Vision first
  if (ENV.GEMINI_API_KEY) {
    try {
      const url = `${GEMINI_BASE}/models/${ENV.GEMINI_CHAT_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;
      const base64Data = fileBuffer.toString('base64');
      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\n${userMessage}` },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: { 
          maxOutputTokens: 2048, 
          temperature: 0.1,
          responseMimeType: 'application/json' 
        }
      };

      const res = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }, 2);

      if (res && res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim() !== '') {
          return text;
        }
      }
    } catch (visionErr) {
      console.warn('[GeminiService] Gemini Vision failed, attempting Groq fallback:', visionErr.message);
    }
  }

  // 2. Groq Fallback with PDF extraction if PDF
  if (ENV.GROQ_API_KEY) {
    try {
      console.log('[GeminiService] Using Groq fallback for document analysis...');
      let docText = '';
      if (mimeType === 'application/pdf') {
        try {
          const { PDFParse } = await import('pdf-parse');
          const parser = new PDFParse({});
          await parser.load(fileBuffer);
          const parsed = await parser.getText();
          docText = parsed?.text || '';
        } catch (pdfErr) {
          console.warn('[GeminiService] PDF text extraction failed:', pdfErr.message);
        }
      }

      const promptWithDoc = docText 
        ? `${userMessage}\n\nExtracted Document Content:\n${docText.slice(0, 12000)}`
        : `${userMessage}\n\nNote: Visual scan of financial document (${mimeType}). Provide general guidelines and standard verification steps based on the user profile.`;

      const groqRes = await groqChat(
        systemPrompt + '\nRespond with ONLY valid JSON.',
        promptWithDoc,
        true
      );

      if (groqRes && groqRes.trim() !== '') {
        return groqRes;
      }
    } catch (groqErr) {
      console.error('[GeminiService] Groq document analysis fallback failed:', groqErr.message);
    }
  }

  throw new LlmUnavailableError('Unable to analyze document. Both vision and fallback models were unavailable.');
};
