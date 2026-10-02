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
