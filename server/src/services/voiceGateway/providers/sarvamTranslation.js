import { ENV } from '../../../config/env.js';
import { TranslationUnavailableError, ProviderNotConfiguredError } from '../errors.js';

const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
};

export const translate = async (text, fromLang, toLang) => {
  if (!ENV.SARVAM_API_KEY) {
    throw new ProviderNotConfiguredError('Sarvam API key is missing.');
  }

  if (fromLang === toLang) return text;

  const sourceCode = LANG_MAP[fromLang] || `${fromLang}-IN`;
  const targetCode = LANG_MAP[toLang] || `${toLang}-IN`;

  const translateChunk = async (chunkText) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': ENV.SARVAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: chunkText,
          source_language_code: sourceCode,
          target_language_code: targetCode,
          mode: 'formal',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        throw new TranslationUnavailableError(`Sarvam HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const translated = data?.translated_text?.trim();

      if (!translated) {
        throw new TranslationUnavailableError('Sarvam translation returned empty text.');
      }

      return translated;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof TranslationUnavailableError || err instanceof ProviderNotConfiguredError) {
        throw err;
      }
      throw new TranslationUnavailableError(`Sarvam request failed: ${err.message}`);
    }
  };

  // If text is short, translate in one shot
  if (text.length <= 900) {
    return await translateChunk(text);
  }

  // Otherwise split on sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];
  const chunks = [];
  let current = '';

  for (const s of sentences) {
    if ((current + s).length > 850) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  const results = [];
  for (const c of chunks) {
    const res = await translateChunk(c.slice(0, 900));
    if (res) results.push(res);
  }
  return results.join(' ');
};
