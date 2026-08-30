/**
 * BhashiniService — wraps Bhashini ULCA API for ASR, MT, and TTS.
 *
 * Bhashini API docs: https://bhashini.gov.in/ulca/model/explore/automatic
 * Auth: ULCA userId + API key in headers.
 *
 * All methods degrade gracefully to a stub when credentials are missing,
 * so the rest of the application can be developed without live Bhashini access.
 *
 * Translation-sandwich flow enforced here:
 *   transcribe() → translateToEnglish() → [LLM] → translateFromEnglish() → synthesize()
 */
import { ENV } from '../../config/env.js';

const BHASHINI_INFERENCE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

const bhashiniHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: ENV.BHASHINI_API_KEY,
  userID: ENV.BHASHINI_USER_ID,
});

const isConfigured = () => ENV.BHASHINI_API_KEY && ENV.BHASHINI_USER_ID;

/* ------------------------------------------------------------------ */
/* ASR — Speech to Text                                                */
/* ------------------------------------------------------------------ */

/**
 * Transcribe audio to text.
 * @param {Buffer} audioBuffer  - raw audio bytes
 * @param {string} sourceLang   - 'te' | 'hi'
 * @returns {Promise<{text: string, language: string}>}
 */
export const transcribeAudio = async (audioBuffer, sourceLang = 'hi') => {
  if (!isConfigured()) {
    console.warn('[Bhashini] Not configured — returning ASR stub');
    return { text: '[STUB] Transcribed text', language: sourceLang };
  }

  const base64Audio = audioBuffer.toString('base64');

  const payload = {
    pipelineTasks: [
      {
        taskType: 'asr',
        config: {
          language: { sourceLanguage: sourceLang },
          serviceId: ENV.BHASHINI_PIPELINE_ID,
          audioFormat: 'wav',
          samplingRate: 16000,
        },
      },
    ],
    inputData: {
      audio: [{ audioContent: base64Audio }],
    },
  };

  const res = await fetch(BHASHINI_INFERENCE_URL, {
    method: 'POST',
    headers: bhashiniHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Bhashini ASR error ${res.status}`);

  const data = await res.json();
  const text = data?.pipelineResponse?.[0]?.output?.[0]?.source ?? '';
  return { text, language: sourceLang };
};

/* ------------------------------------------------------------------ */
/* MT — Machine Translation                                             */
/* ------------------------------------------------------------------ */

/**
 * Translate text between languages.
 * @param {string} text
 * @param {string} sourceLang - 'te' | 'hi' | 'en'
 * @param {string} targetLang - 'te' | 'hi' | 'en'
 * @returns {Promise<string>}
 */
export const translateText = async (text, sourceLang, targetLang) => {
  if (sourceLang === targetLang) return text;

  if (!isConfigured()) {
    console.warn('[Bhashini] Not configured — returning MT stub');
    return `[STUB:${sourceLang}→${targetLang}] ${text}`;
  }

  const payload = {
    pipelineTasks: [
      {
        taskType: 'translation',
        config: {
          language: { sourceLanguage: sourceLang, targetLanguage: targetLang },
          serviceId: ENV.BHASHINI_PIPELINE_ID,
        },
      },
    ],
    inputData: { input: [{ source: text }] },
  };

  const res = await fetch(BHASHINI_INFERENCE_URL, {
    method: 'POST',
    headers: bhashiniHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Bhashini MT error ${res.status}`);

  const data = await res.json();
  return data?.pipelineResponse?.[0]?.output?.[0]?.target ?? text;
};

/** Convenience: native language → English */
export const translateToEnglish = (text, sourceLang) =>
  translateText(text, sourceLang, 'en');

/** Convenience: English → native language */
export const translateFromEnglish = (text, targetLang) =>
  translateText(text, 'en', targetLang);

/* ------------------------------------------------------------------ */
/* TTS — Text to Speech                                                */
/* ------------------------------------------------------------------ */

/**
 * Synthesize text to audio.
 * @param {string} text
 * @param {string} targetLang - 'te' | 'hi'
 * @returns {Promise<{audioBase64: string, mimeType: string}>}
 */
export const synthesizeSpeech = async (text, targetLang = 'hi') => {
  if (!isConfigured()) {
    console.warn('[Bhashini] Not configured — returning TTS stub');
    return { audioBase64: '', mimeType: 'audio/wav', stub: true };
  }

  const payload = {
    pipelineTasks: [
      {
        taskType: 'tts',
        config: {
          language: { sourceLanguage: targetLang },
          serviceId: ENV.BHASHINI_PIPELINE_ID,
          gender: 'female',
          samplingRate: 8000,
        },
      },
    ],
    inputData: { input: [{ source: text }] },
  };

  const res = await fetch(BHASHINI_INFERENCE_URL, {
    method: 'POST',
    headers: bhashiniHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Bhashini TTS error ${res.status}`);

  const data = await res.json();
  const audioBase64 = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent ?? '';
  return { audioBase64, mimeType: 'audio/wav' };
};
