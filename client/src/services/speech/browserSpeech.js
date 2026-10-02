import { voiceService } from '../../api/services';

const langMap = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

let mediaRecorder = null;
let audioChunks = [];
let currentUtterance = null;

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
    if (!window.speechSynthesis) return false;
    const targetLang = langMap[lang];
    const voices = await waitForVoices();
    return voices.some(v => v.lang.startsWith(targetLang.split('-')[0]));
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
    return new Promise(async (resolve, reject) => {
      if (!window.speechSynthesis) {
        return resolve();
      }

      speechProvider.stop(); // cancel ongoing speech

      const targetLang = langMap[lang] || 'hi-IN';
      const voices = await waitForVoices();
      const voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0])) || voices[0];

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice ? voice.lang : targetLang;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  },

  stop: () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  }
};
