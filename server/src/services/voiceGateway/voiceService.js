import { translateWithFallback, getOrderedProviders } from './factory.js';
import { getHandler } from './handlerRegistry.js';
import { TranslationUnavailableError } from './errors.js';

const timeoutPromise = (ms, promise) => {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Gateway client request timed out after 15s'));
    }, ms);
  });
  return Promise.race([
    promise,
    timeout
  ]).finally(() => clearTimeout(timeoutId));
};

export const getCapabilities = () => {
  return {
    orderedChain: getOrderedProviders().map(p => p.name),
    activeProviders: {
      asr: 'browserSpeech',
      mt: 'factory_fallback',
      tts: 'browserSpeech'
    },
    usedFallback: false // Historical or current request flag can be added here if tracked globally
  };
};

export const processQuery = async (text, lang, moduleName) => {
  return timeoutPromise(15000, (async () => {
    let englishQuery = text;
    let usedFallback = false;

    if (lang !== 'en') {
      const resultIn = await translateWithFallback(text, lang, 'en');
      englishQuery = resultIn.translated;
      usedFallback = usedFallback || resultIn.usedFallback;
    }

    const handler = getHandler(moduleName);
    if (!handler) {
      return {
        english_query: englishQuery,
        english_answer: '',
        native_answer: '',
        translation_failed: false,
        used_fallback: usedFallback,
        status: 'module_not_ready'
      };
    }

    const englishAnswer = await handler(englishQuery);
    
    if (lang === 'en') {
      return {
        english_query: englishQuery,
        english_answer: englishAnswer,
        native_answer: englishAnswer,
        translation_failed: false,
        used_fallback: usedFallback
      };
    }

    let nativeAnswer = '';
    let translationFailed = false;

    try {
      const resultOut = await translateWithFallback(englishAnswer, 'en', lang);
      nativeAnswer = resultOut.translated;
      usedFallback = usedFallback || resultOut.usedFallback;
    } catch (err) {
      console.error('[VoiceGateway] Translate-out failed:', err.message);
      nativeAnswer = englishAnswer;
      translationFailed = true;
    }

    return {
      english_query: englishQuery,
      english_answer: englishAnswer,
      native_answer: nativeAnswer,
      translation_failed: translationFailed,
      used_fallback: usedFallback
    };
  })());
};

export const translateText = async (text, fromLang, toLang) => {
  if (fromLang === toLang) return { translated: text, usedFallback: false };
  return await translateWithFallback(text, fromLang, toLang);
};
