import * as voiceService from '../services/voiceGateway/voiceService.js';
import { TranslationUnavailableError } from '../services/voiceGateway/errors.js';

const ALLOWED_LANGS = ['te', 'hi', 'en'];
const ALLOWED_MODULES = ['echo', 'literacy', 'home'];

export const getCapabilities = (req, res) => {
  const caps = voiceService.getCapabilities();
  res.json(caps);
};

export const translate = async (req, res) => {
  const { text, from, to } = req.body;
  if (!text || typeof text !== 'string' || text.length > 4000) {
    return res.status(400).json({ error: 'text must be a non-empty string under 4000 characters' });
  }
  if (!ALLOWED_LANGS.includes(from) || !ALLOWED_LANGS.includes(to)) {
    return res.status(400).json({ error: 'from and to must be te, hi, or en' });
  }

  try {
    const start = Date.now();
    const result = await voiceService.translateText(text, from, to);
    console.log(`[Controller] translate ${from}->${to} latency: ${Date.now() - start}ms`);
    res.json({ translated: result.translated });
  } catch (err) {
    if (err instanceof TranslationUnavailableError) {
      return res.status(503).json({ error: 'Translation unavailable. Please try again or use English text.' });
    }
    throw err;
  }
};

export const query = async (req, res) => {
  const { text, lang, module } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim() === '' || text.length > 1000) {
    return res.status(400).json({ error: 'text must be a non-empty string under 1000 characters' });
  }
  if (!ALLOWED_LANGS.includes(lang)) {
    return res.status(400).json({ error: 'lang must be te, hi, or en' });
  }
  if (!ALLOWED_MODULES.includes(module)) {
    return res.status(400).json({ error: 'invalid module' });
  }

  try {
    const targetModule = module === 'home' ? 'literacy' : module;
    const start = Date.now();
    const result = await voiceService.processQuery(text, lang, targetModule);
    console.log(`[Controller] query module=${targetModule} lang=${lang} latency=${Date.now() - start}ms`);
    res.json(result);
  } catch (err) {
    if (err.message.includes('timed out')) {
      return res.status(504).json({ error: 'Request timed out' });
    }
    if (err instanceof TranslationUnavailableError) {
      return res.status(503).json({ error: 'Translation unavailable. Please try again or switch to text.' });
    }
    throw err;
  }
};

export const transcribe = (req, res) => {
  res.status(501).json({ error: 'Transcribe is handled client-side by browserSpeech.' });
};

export const synthesize = (req, res) => {
  res.status(501).json({ error: 'Synthesize is handled client-side by browserSpeech.' });
};
