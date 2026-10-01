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

/**
 * Send a prompt to Gemini in strict mode. Throws LlmUnavailableError on failure,
 * missing key, or empty output. Never returns a stub.
 */
export const geminiChatStrict = async (systemPrompt, userMessage) => {
  if (!ENV.GEMINI_API_KEY) {
    throw new LlmUnavailableError('Missing GEMINI_API_KEY');
  }

  const url = `${GEMINI_BASE}/models/${ENV.GEMINI_CHAT_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] },
    ],
    generationConfig: { maxOutputTokens: 1024, temperature: 0.2 },
  };

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new LlmUnavailableError(`Network error reaching Gemini: ${error.message}`);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new LlmUnavailableError(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text || text.trim() === '') {
    throw new LlmUnavailableError('Gemini returned empty or blocked output');
  }

  return text;
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

  const res = await fetch(url, {
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
