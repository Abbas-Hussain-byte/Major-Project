import { ENV } from '../../config/env.js';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-1.5-flash-latest';

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

  const url = `${GEMINI_BASE}/models/${MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;

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
 * Generate an embedding vector for the given text.
 * Used by EmbeddingService — do not call directly from controllers.
 *
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const geminiEmbed = async (text) => {
  if (!ENV.GEMINI_API_KEY) {
    console.warn('[GeminiService] No API key — returning zero embedding stub');
    return new Array(768).fill(0);
  }

  const url = `${GEMINI_BASE}/models/text-embedding-004:embedContent?key=${ENV.GEMINI_API_KEY}`;

  const body = {
    model: 'models/text-embedding-004',
    content: { parts: [{ text }] },
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
