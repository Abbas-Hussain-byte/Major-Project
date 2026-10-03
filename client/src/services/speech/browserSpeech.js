import { voiceService } from '../../api/services';

const langMap = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

let mediaRecorder = null;
let audioChunks = [];
let currentUtterance = null;
let currentAudio = null;

const waitForVoices = () => {
  return new Promise(resolve => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) return resolve(voices);
    
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
};

export const speechProvider = {
  isSupported: () => !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia,

  hasVoice: async (lang) => {
    return true; // Supported via Sarvam TTS backend and Web Speech API
  },

  listen: (lang) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          return reject(new Error('unsupported'));
        }

        speechProvider.stop();
        audioChunks = [];

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        let silenceTimer = null;
        let isSettled = false;

        const settle = (action) => {
          if (isSettled) return;
          isSettled = true;
          if (silenceTimer) clearTimeout(silenceTimer);
          stream.getTracks().forEach(track => track.stop());
          action();
        };

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (audioChunks.length === 0) {
            return settle(() => reject(new Error('no-speech')));
          }
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          try {
            // Send to backend STT (Sarvam)
            const formData = new FormData();
            formData.append('audio', audioBlob, 'speech.wav');
            formData.append('language', lang);
            
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/voice/transcribe`, {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              throw new Error('Transcription failed');
            }
            
            const data = await response.json();
            if (data && data.text) {
              settle(() => resolve(data.text));
            } else {
              settle(() => reject(new Error('no-speech')));
            }
          } catch (error) {
            console.error('STT Error:', error);
            settle(() => reject(new Error('network')));
          }
        };

        mediaRecorder.onerror = () => {
          settle(() => reject(new Error('audio-capture')));
        };

        mediaRecorder.start();
        
        // Stop automatically after 10 seconds
        silenceTimer = setTimeout(() => {
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 10000);

      } catch (err) {
        if (err.name === 'NotAllowedError') {
          reject(new Error('not-allowed'));
        } else {
          reject(new Error('audio-capture'));
        }
      }
    });
  },

  speak: async (text, lang) => {
    speechProvider.stop(); // cancel ongoing speech / audio
    if (!text || !text.trim()) return;

    let textToSynthesize = text.trim();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Guard: If lang is te or hi, but the input text contains only English/Latin characters,
    // translate it to the target language first so it is never spoken in English!
    const hasTelugu = /[\u0C00-\u0C7F]/.test(textToSynthesize);
    const hasHindi = /[\u0900-\u097F]/.test(textToSynthesize);

    if (lang === 'te' && !hasTelugu) {
      try {
        const transRes = await fetch(`${apiUrl}/voice/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSynthesize.slice(0, 800), from: 'en', to: 'te' })
        });
        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.translated) textToSynthesize = transData.translated;
        }
      } catch (e) {
        console.warn('[speechProvider] Pre-speak translation to Telugu failed:', e.message);
      }
    } else if (lang === 'hi' && !hasHindi) {
      try {
        const transRes = await fetch(`${apiUrl}/voice/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSynthesize.slice(0, 800), from: 'en', to: 'hi' })
        });
        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.translated) textToSynthesize = transData.translated;
        }
      } catch (e) {
        console.warn('[speechProvider] Pre-speak translation to Hindi failed:', e.message);
      }
    }

    // 1. Primary: High-fidelity authentic Indian native speech via Sarvam AI TTS
    try {
      const res = await fetch(`${apiUrl}/voice/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSynthesize, lang })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.audio) {
          return new Promise((resolve) => {
            const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
            currentAudio = audio;
            audio.onended = () => {
              currentAudio = null;
              resolve();
            };
            audio.onerror = () => {
              currentAudio = null;
              resolve();
            };
            audio.play().catch((playErr) => {
              console.warn('[speechProvider] Audio play error:', playErr);
              currentAudio = null;
              resolve();
            });
          });
        }
      }
    } catch (err) {
      console.warn('[speechProvider] Sarvam TTS request failed, trying browser speech fallback:', err.message);
    }

    // 2. Fallback: Browser Web Speech API ONLY if matching voice exists or English
    return new Promise(async (resolve) => {
      if (!window.speechSynthesis) {
        return resolve();
      }

      const targetLang = langMap[lang] || 'hi-IN';
      const voices = await waitForVoices();
      
      // Look for a native matching voice for this specific language code
      const matchedVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));

      // Never use default English voice if citizen selected Telugu or Hindi and no native voice exists
      if (lang !== 'en' && !matchedVoice) {
        console.warn(`[speechProvider] No native ${lang} voice installed in browser; skipped to avoid incorrect English voice.`);
        return resolve();
      }

      const utterance = new SpeechSynthesisUtterance(textToSynthesize);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetLang;
      }

      utterance.onend = () => {
        currentUtterance = null;
        resolve();
      };
      utterance.onerror = () => {
        currentUtterance = null;
        resolve();
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  },

  stop: () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder = null;
    }
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch {}
      currentAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  }
};

