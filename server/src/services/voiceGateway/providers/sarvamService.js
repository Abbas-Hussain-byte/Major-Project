import { ENV } from '../../../config/env.js';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

export const transcribeAudio = async (audioBuffer, sourceLang = 'hi') => {
  if (!SARVAM_API_KEY) {
    console.warn('[Sarvam] API key not found in environment, returning stub');
    return { text: '[STUB] Sarvam STT Transcription', language: 'en' };
  }

  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
  // Saaras supports prompt and model parameters if needed. We use mode="translate" to get English directly if the user speaks Telugu/Hindi.
  
  // Wait, looking at Sarvam STT API for saaras v4 (speech-to-text-translate):
  // According to standard Sarvam Saaras docs, there is an endpoint for speech to text translate.
  // Actually, Sarvam docs for speech-to-text-translate:
  // POST https://api.sarvam.ai/speech-to-text-translate
  formData.append('prompt', ''); // Optional prompt
  // The API automatically detects source language or it translates Indic speech directly to English

  try {
    const response = await fetch('https://api.sarvam.ai/speech-to-text-translate', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sarvam STT failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return { text: data.transcript, language: 'en' };
  } catch (error) {
    console.error('Sarvam STT Error:', error);
    throw error;
  }
};

export const synthesizeSpeech = async (text, lang = 'hi') => {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('Sarvam API key missing');
  }

  // Clean markdown asterisks, hashes, brackets before sending to TTS
  let cleanText = text
    .replace(/[*#_~`\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return { audio: null };

  // Safeguard: If lang is te or hi, but the text is predominantly Latin/English script,
  // translate it to the target Indic language first so it is never spoken in English!
  const hasTelugu = /[\u0C00-\u0C7F]/.test(cleanText);
  const hasHindi = /[\u0900-\u097F]/.test(cleanText);

  if (lang === 'te' && !hasTelugu) {
    try {
      const { translateWithFallback } = await import('../factory.js');
      const res = await translateWithFallback(cleanText.slice(0, 800), 'en', 'te');
      if (res && res.translated) {
        cleanText = res.translated;
      }
    } catch (e) {
      console.warn('[SarvamTTS] Auto-translate English to Telugu failed:', e.message);
    }
  } else if (lang === 'hi' && !hasHindi) {
    try {
      const { translateWithFallback } = await import('../factory.js');
      const res = await translateWithFallback(cleanText.slice(0, 800), 'en', 'hi');
      if (res && res.translated) {
        cleanText = res.translated;
      }
    } catch (e) {
      console.warn('[SarvamTTS] Auto-translate English to Hindi failed:', e.message);
    }
  }

  const langCode = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  const speaker = lang === 'te' ? 'kavitha' : lang === 'hi' ? 'ritu' : 'simran';

  // Up to 500 characters on clean sentence boundary
  let inputText = cleanText;
  if (inputText.length > 500) {
    const lastPunct = Math.max(inputText.lastIndexOf('.', 500), inputText.lastIndexOf('?', 500), inputText.lastIndexOf('।', 500));
    inputText = lastPunct > 150 ? inputText.slice(0, lastPunct + 1) : inputText.slice(0, 500);
  }

  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: [inputText],
      target_language_code: langCode,
      speaker: speaker,
      pitch: 0,
      pace: 1.0,
      loudness: 1.5,
      speech_sample_rate: 8000,
      enable_preprocessing: true,
      model: 'bulbul:v3'
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam TTS error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return { audio: data.audios?.[0] || null };
};

