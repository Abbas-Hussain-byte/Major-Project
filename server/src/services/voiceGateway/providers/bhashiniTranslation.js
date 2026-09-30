import { ENV } from '../../../config/env.js';
import { ProviderNotConfiguredError } from '../errors.js';

/**
 * Bhashini translation provider stub.
 * Will throw ProviderNotConfiguredError until credentials are provided.
 * @see docs/bhashini-verified-shapes.md
 */
export const translate = async (text, fromLang, toLang) => {
  throw new ProviderNotConfiguredError('Bhashini credentials pending. Fallback to browser_gemini.');
};
