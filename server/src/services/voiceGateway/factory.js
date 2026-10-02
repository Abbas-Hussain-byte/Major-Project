import { ENV } from '../../config/env.js';
import * as bhashiniTranslation from './providers/bhashiniTranslation.js';
import * as geminiTranslation from './providers/geminiTranslation.js';
import * as sarvamTranslation from './providers/sarvamTranslation.js';
import { ProviderNotConfiguredError, TranslationUnavailableError } from './errors.js';

const providerMap = {
  'sarvam': sarvamTranslation,
  'browser_gemini': geminiTranslation,
  'bhashini': bhashiniTranslation,
};

export const getOrderedProviders = () => {
  return ENV.VOICE_PROVIDERS.map(p => {
    return { name: p, impl: providerMap[p] };
  }).filter(p => p.impl); // Ensure valid names
};

/**
 * Walks the configured VOICE_PROVIDERS fallback chain.
 */
export const translateWithFallback = async (text, fromLang, toLang) => {
  const providers = getOrderedProviders();
  let lastError = null;
  let usedFallback = false;

  for (let i = 0; i < providers.length; i++) {
    const { name, impl } = providers[i];
    try {
      const startTime = Date.now();
      const translated = await impl.translate(text, fromLang, toLang);
      const latency = Date.now() - startTime;
      
      console.log(`[VoiceGateway] Translation successful via ${name}, latency: ${latency}ms`);
      return { translated, usedFallback, provider: name };
    } catch (err) {
      if (err instanceof ProviderNotConfiguredError) {
        console.log(`[VoiceGateway] Skipping ${name} (not configured).`);
        usedFallback = true;
        continue;
      }
      
      console.error(`[VoiceGateway] Provider ${name} failed:`, err.message);
      lastError = err;
      usedFallback = true;
      // Fall through to the next provider
    }
  }

  throw new TranslationUnavailableError(`All providers failed. Last error: ${lastError?.message || 'No providers available'}`);
};
