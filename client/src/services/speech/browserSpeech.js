const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const langMap = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

let currentRecognition = null;
let silenceTimer = null;
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
  isSupported: () => !!SpeechRecognition && !!window.speechSynthesis,

  hasVoice: async (lang) => {
    if (!window.speechSynthesis) return false;
    const targetLang = langMap[lang];
    const voices = await waitForVoices();
    return voices.some(v => v.lang.startsWith(targetLang.split('-')[0]));
  },

  listen: (lang) => {
    return new Promise((resolve, reject) => {
      if (!SpeechRecognition) {
        return reject(new Error('unsupported'));
      }

      speechProvider.stop();

      const recognition = new SpeechRecognition();
      recognition.lang = langMap[lang] || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      currentRecognition = recognition;
      let isSettled = false;

      const settle = (action) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(silenceTimer);
        action();
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        settle(() => resolve(transcript));
      };

      recognition.onerror = (event) => {
        // map errors distinctly
        let errMsg = event.error;
        if (errMsg === 'not-allowed' || errMsg === 'no-speech' || errMsg === 'network' || errMsg === 'audio-capture') {
            // keep as is
        }
        settle(() => reject(new Error(errMsg)));
      };

      recognition.onend = () => {
        settle(() => reject(new Error('no-speech')));
      };

      try {
        recognition.start();
        silenceTimer = setTimeout(() => {
          recognition.stop();
          settle(() => reject(new Error('no-speech'))); // 10s silence timeout
        }, 10000);
      } catch (err) {
        settle(() => reject(new Error('audio-capture')));
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
    if (currentRecognition) {
      currentRecognition.stop();
      currentRecognition = null;
    }
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  }
};
