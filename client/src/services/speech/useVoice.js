import { useState, useEffect, useRef, useCallback } from 'react';
import { speechProvider } from './browserSpeech';

export function useVoice({ lang = 'en', moduleName = 'literacy' } = {}) {
  const [micState, setMicState] = useState('idle'); // idle | listening | processing | speaking | error
  const [errorMsg, setErrorMsg] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [lastAnswer, setLastAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [responseStatus, setResponseStatus] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechProvider.stop();
    };
  }, []);

  const executeQuery = useCallback(async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    setErrorMsg('');
    setLastQuery(queryText);
    setMicState('processing');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/voice/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: queryText.trim(), lang, module: moduleName })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      if (data.status === 'module_not_ready') {
        throw new Error('This module is not ready yet.');
      }

      setResponseStatus(data.status || 'grounded');
      setSources(data.sources || []);

      // Answer selection
      let answerText = data.native_answer || data.english_answer;
      if (!answerText) {
        if (data.status === 'not_grounded') {
          answerText = 'I could not find official government documentation for this question. Please ask about schemes such as PMJJBY, PMSBY, APY, or PMJDY.';
        } else if (data.status === 'llm_unavailable') {
          answerText = 'The AI assistant is temporarily busy. Please try asking again in a moment.';
        } else {
          answerText = 'No response could be generated. Please try rephrasing your question.';
        }
      }

      setLastAnswer(answerText);
      setMicState('idle');

      // Attempt Text-to-Speech if supported
      try {
        const hasVoice = await speechProvider.hasVoice(lang);
        let textToSpeak = answerText;
        let speakLang = lang;

        if (data.translation_failed || !hasVoice) {
          speakLang = 'en';
          textToSpeak = data.english_answer || answerText;
        }

        if (textToSpeak) {
          setIsSpeaking(true);
          await speechProvider.speak(textToSpeak, speakLang);
          setIsSpeaking(false);
        }
      } catch (speechErr) {
        console.warn('[useVoice] Text-to-speech skipped or interrupted:', speechErr);
        setIsSpeaking(false);
      }

      return data;
    } catch (err) {
      console.error('[useVoice] Query failed:', err);
      setMicState('error');
      let msg = err.message || 'Something went wrong.';
      if (err.message === 'network' || err.message.includes('fetch')) {
        msg = 'Unable to connect to BenefitLens server. Please ensure the backend is running.';
      }
      setErrorMsg(msg);
      throw err;
    }
  }, [lang, moduleName]);

  const startListening = useCallback(async (textFallbackCallback) => {
    setErrorMsg('');
    setLastAnswer('');
    setSources([]);
    setMicState('listening');

    try {
      if (!speechProvider.isSupported()) {
        throw new Error('unsupported');
      }

      const transcript = await speechProvider.listen(lang);
      if (!transcript || !transcript.trim()) {
        throw new Error('no-speech');
      }

      await executeQuery(transcript);
    } catch (err) {
      setMicState('error');

      let msg = 'Could not capture audio.';
      if (err.message === 'not-allowed') msg = 'Microphone permission denied in browser.';
      else if (err.message === 'no-speech') msg = 'No speech heard. Please tap and speak clearly.';
      else if (err.message === 'audio-capture') msg = 'No microphone device was detected.';
      else if (err.message === 'unsupported') msg = 'Your browser does not support Web Speech. Please type below.';
      else if (err.message) msg = err.message;

      setErrorMsg(msg);

      if (textFallbackCallback) {
        textFallbackCallback();
      }
    }
  }, [lang, executeQuery]);

  const askText = useCallback(async (text) => {
    return await executeQuery(text);
  }, [executeQuery]);

  const replaySpeech = useCallback(async () => {
    if (!lastAnswer) return;
    try {
      setIsSpeaking(true);
      await speechProvider.speak(lastAnswer, lang);
      setIsSpeaking(false);
    } catch (err) {
      console.warn('[useVoice] Replay failed:', err);
      setIsSpeaking(false);
    }
  }, [lastAnswer, lang]);

  const stop = useCallback(() => {
    speechProvider.stop();
    setMicState('idle');
    setIsSpeaking(false);
  }, []);

  return {
    micState,
    errorMsg,
    lastQuery,
    lastAnswer,
    sources,
    responseStatus,
    isSpeaking,
    startListening,
    askText,
    replaySpeech,
    stop
  };
}
