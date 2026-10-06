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

const CANONICAL_SAFETY_NET_QUERIES = [
  {
    // PMJJBY life insurance
    matches: ['pmjjby', 'జీవిత బీమా', 'जीवन बीमा', 'life insurance', 'జేజేబీవై', 'jeevan jyoti'],
    keywords: ['అర్హు', 'అర్హత', 'పాత్', 'पात्र', 'eligible', 'eligibility', 'join', 'rules', 'age'],
    canonical: 'Am I eligible for PMJJBY life insurance? What are the age criteria, coverage amount, and annual cost?'
  },
  {
    // Ayushman Bharat free hospital
    matches: ['ayushman', 'ఆయుష్మాన్', 'आयुष्मान', 'pmjay', 'pm-jay', 'ఆరోగ్య', 'arogya'],
    keywords: ['ఉచిత', 'చికిత్స', 'मुफ्त', 'इलाज', 'hospital', 'care', 'free', 'treatment'],
    canonical: 'How to get free hospital care and treatment with Ayushman Bharat PM-JAY?'
  },
  {
    // Pension for unorganised workers
    matches: ['pension', 'పింఛన్', 'పెన్షన్', 'पेंशन', 'pmsym', 'maan-dhan', 'apy', 'atal pension'],
    keywords: ['అసంఘటిత', 'కార్మికులు', 'मजदूर', 'असंगठित', 'unorganised', 'unorganized', 'old age', 'worker'],
    canonical: 'How do unorganised workers get an old age pension under PM-SYM or Atal Pension Yojana?'
  },
  {
    // Zero balance / bank account without KYC
    matches: ['kyc', 'కేవైసీ', 'కెవైసి', 'కేవైసి', 'bsbd', 'small account'],
    keywords: ['లేకుండా', 'ఖాతా', 'बिना', 'खाता', 'without', 'open', 'bank account'],
    canonical: 'Can I open a bank account or small account without full KYC documents?'
  },
  {
    // PMSBY accidental cover
    matches: ['pmsby', 'suraksha', 'సురక్ష', 'सुरक्षा', 'ప్రమాద', 'దుర్ఘటన', 'दुर्घटना', 'accidental'],
    keywords: ['work', 'పనిచేస్తుంది', 'काम करता', 'cover', 'premium'],
    canonical: 'How does PMSBY accidental cover work and what is the annual premium and benefit?'
  },
  {
    // Jan Dhan account documents
    matches: ['jan dhan', 'jandhan', 'pmjdy', 'జన్ ధన్', 'జన్‌ధన్', 'जन धन', 'जनधन'],
    keywords: ['పత్రాలు', 'దస్తావేజులు', 'दस्तावेज', 'documents', 'needed', 'required', 'paperwork'],
    canonical: 'What documents are needed to open a Pradhan Mantri Jan Dhan Yojana account?'
  }
];

const findCanonicalQuery = (queryText) => {
  if (!queryText) return null;
  const qLower = queryText.toLowerCase();
  for (const item of CANONICAL_SAFETY_NET_QUERIES) {
    const hasMatch = item.matches.some(m => qLower.includes(m.toLowerCase()));
    if (hasMatch) {
      const hasKeyword = item.keywords.some(k => qLower.includes(k.toLowerCase()));
      if (hasKeyword) return item.canonical;
    }
  }
  return null;
};

export const processQuery = async (text, lang, moduleName) => {
  return timeoutPromise(25000, (async () => {
    let englishQuery = text;
    let usedFallback = false;

    // Check canonical safety net query normalization first
    const canonical = findCanonicalQuery(text);
    if (canonical) {
      englishQuery = canonical;
    } else if (lang !== 'en') {
      const resultIn = await translateWithFallback(text, lang, 'en');
      englishQuery = resultIn.translated;
      usedFallback = usedFallback || resultIn.usedFallback;

      // Re-check canonical normalization on translated English
      const postTransCanonical = findCanonicalQuery(englishQuery);
      if (postTransCanonical) {
        englishQuery = postTransCanonical;
      }
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

    const handlerResult = await handler(englishQuery);
    
    // Handlers can return a string (old way) or { status, text, sources } (new way)
    let englishAnswer = '';
    let finalStatus = 'grounded';
    let sources = [];
    
    if (typeof handlerResult === 'string') {
      englishAnswer = handlerResult;
    } else {
      englishAnswer = handlerResult.text || '';
      finalStatus = handlerResult.status || 'grounded';
      sources = handlerResult.sources || [];
    }
    
    if (lang === 'en') {
      return {
        english_query: englishQuery,
        english_answer: englishAnswer,
        native_answer: englishAnswer,
        translation_failed: false,
        used_fallback: usedFallback,
        status: finalStatus,
        sources
      };
    }

    let nativeAnswer = '';
    let translationFailed = false;

    if (englishAnswer) {
      try {
        const resultOut = await translateWithFallback(englishAnswer, 'en', lang);
        nativeAnswer = resultOut.translated;
        usedFallback = usedFallback || resultOut.usedFallback;
      } catch (err) {
        if (!process.env.VITEST) console.error('[VoiceGateway] Translate-out failed:', err.message);
        nativeAnswer = englishAnswer;
        translationFailed = true;
      }
    }

    return {
      english_query: englishQuery,
      english_answer: englishAnswer,
      native_answer: nativeAnswer || englishAnswer,
      translation_failed: translationFailed,
      used_fallback: usedFallback,
      status: finalStatus,
      sources
    };
  })());
};

export const translateText = async (text, fromLang, toLang) => {
  if (fromLang === toLang) return { translated: text, usedFallback: false };
  return await translateWithFallback(text, fromLang, toLang);
};
