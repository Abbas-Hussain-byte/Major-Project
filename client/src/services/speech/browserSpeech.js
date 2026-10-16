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
let currentAbortController = null;
let currentSpeechResolve = null;

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

    const controller = new AbortController();
    currentAbortController = controller;

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
          body: JSON.stringify({ text: textToSynthesize.slice(0, 800), from: 'en', to: 'te' }),
          signal: controller.signal
        });
        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.translated) textToSynthesize = transData.translated;
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        console.warn('[speechProvider] Pre-speak translation to Telugu failed:', e.message);
      }
    } else if (lang === 'hi' && !hasHindi) {
      try {
        const transRes = await fetch(`${apiUrl}/voice/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSynthesize.slice(0, 800), from: 'en', to: 'hi' }),
          signal: controller.signal
        });
        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.translated) textToSynthesize = transData.translated;
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        console.warn('[speechProvider] Pre-speak translation to Hindi failed:', e.message);
      }
    }

    if (controller.signal.aborted) return;

    // 1. Primary: High-fidelity authentic Indian native speech via Sarvam AI TTS
    try {
      const res = await fetch(`${apiUrl}/voice/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSynthesize, lang }),
        signal: controller.signal
      });

      if (res.ok) {
        const data = await res.json();
        if (controller.signal.aborted) return;
        if (data && data.audio) {
          return new Promise((resolve) => {
            if (controller.signal.aborted) return resolve();
            currentSpeechResolve = resolve;
            const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
            currentAudio = audio;

            const finish = () => {
              if (currentAudio === audio) currentAudio = null;
              if (currentSpeechResolve === resolve) {
                currentSpeechResolve = null;
                resolve();
              }
            };

            audio.onended = finish;
            audio.onerror = finish;
            audio.onpause = () => {
              if (!currentAudio || currentAudio !== audio) finish();
            };

            audio.play().catch((playErr) => {
              console.warn('[speechProvider] Audio play error:', playErr);
              finish();
            });
          });
        }
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      console.warn('[speechProvider] Sarvam TTS request failed, trying browser speech fallback:', err.message);
    }

    if (controller.signal.aborted) return;

    // 2. Fallback: Browser Web Speech API ONLY if matching voice exists or English
    return new Promise(async (resolve) => {
      if (controller.signal.aborted) return resolve();
      if (!window.speechSynthesis) {
        return resolve();
      }

      currentSpeechResolve = resolve;
      const targetLang = langMap[lang] || 'hi-IN';
      const voices = await waitForVoices();
      
      if (controller.signal.aborted) {
        if (currentSpeechResolve === resolve) currentSpeechResolve = null;
        return resolve();
      }

      // Look for a native matching voice for this specific language code
      const matchedVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));

      // Never use default English voice if citizen selected Telugu or Hindi and no native voice exists
      if (lang !== 'en' && !matchedVoice) {
        console.warn(`[speechProvider] No native ${lang} voice installed in browser; skipped to avoid incorrect English voice.`);
        if (currentSpeechResolve === resolve) currentSpeechResolve = null;
        return resolve();
      }

      const utterance = new SpeechSynthesisUtterance(textToSynthesize);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetLang;
      }

      const finish = () => {
        currentUtterance = null;
        if (currentSpeechResolve === resolve) {
          currentSpeechResolve = null;
          resolve();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  },

  stop: () => {
    if (currentAbortController) {
      try {
        currentAbortController.abort();
      } catch {}
      currentAbortController = null;
    }
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      try {
        mediaRecorder.stop();
      } catch {}
      mediaRecorder = null;
    }
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.src = '';
      } catch {}
      currentAudio = null;
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      currentUtterance = null;
    }
    if (currentSpeechResolve) {
      const res = currentSpeechResolve;
      currentSpeechResolve = null;
      res();
    }
  }
};

