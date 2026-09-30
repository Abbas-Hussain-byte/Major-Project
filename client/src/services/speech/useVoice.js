import { useState, useEffect, useRef } from 'react';
import { speechProvider } from './browserSpeech';

export function useVoice({ lang, moduleName }) {
  const [micState, setMicState] = useState('idle'); // idle | listening | processing | error
  const [errorMsg, setErrorMsg] = useState('');
  const [lastAnswer, setLastAnswer] = useState('');
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechProvider.stop();
    };
  }, []);

  const startListening = async (textFallbackCallback) => {
    setErrorMsg('');
    setLastAnswer('');
    setMicState('listening');

    try {
      if (!speechProvider.isSupported()) {
        throw new Error('unsupported');
      }

      const transcript = await speechProvider.listen(lang);
      
      setMicState('processing');

      // Call API
      const res = await fetch(`${import.meta.env.VITE_API_URL}/voice/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript, lang, module: moduleName })
      });

      if (!res.ok) {
        throw new Error('network');
      }

      const data = await res.json();
      
      if (data.status === 'module_not_ready') {
        throw new Error('module_not_ready');
      }

      const hasVoice = await speechProvider.hasVoice(lang);
      
      // Select text to speak and display
      let textToSpeak = data.native_answer;
      let textToDisplay = data.native_answer;

      if (!hasVoice) {
        textToSpeak = null; // Can't speak native
        textToDisplay = `${data.native_answer}\n\n(Voice output unavailable for this language)`;
      } else if (data.translation_failed) {
        // Translate out failed, we must read English answer if supported, or display it
        const hasEnVoice = await speechProvider.hasVoice('en');
        if (hasEnVoice) {
          textToSpeak = data.english_answer;
        } else {
          textToSpeak = null;
        }
        textToDisplay = `${data.english_answer}\n\n(Translation to native language failed)`;
      }

      setLastAnswer(textToDisplay);
      setMicState('idle');

      if (textToSpeak) {
        await speechProvider.speak(textToSpeak, data.translation_failed ? 'en' : lang);
      }

    } catch (err) {
      setMicState('error');
      
      let msg = 'Something went wrong.';
      if (err.message === 'not-allowed') msg = 'Microphone permission denied.';
      else if (err.message === 'no-speech') msg = 'No speech detected.';
      else if (err.message === 'audio-capture') msg = 'Audio capture failed.';
      else if (err.message === 'network') msg = 'Network error. Please try again.';
      else if (err.message === 'unsupported') msg = 'Browser does not support speech.';
      else if (err.message === 'module_not_ready') msg = 'This feature is not ready yet.';
      
      setErrorMsg(msg);
      
      if (textFallbackCallback) {
        textFallbackCallback(); // Notify UI to show text fallback
      }
    }
  };

  const stop = () => {
    speechProvider.stop();
    setMicState('idle');
  };

  return { micState, errorMsg, lastAnswer, startListening, stop };
}
