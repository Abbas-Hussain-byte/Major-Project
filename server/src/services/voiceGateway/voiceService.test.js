import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processQuery, getCapabilities } from './voiceService.js';
import * as factory from './factory.js';
import * as handlerRegistry from './handlerRegistry.js';
import { TranslationUnavailableError, ProviderNotConfiguredError } from './errors.js';

describe('Voice Gateway - voiceService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    handlerRegistry.registerHandler('test_module', async (q) => `Answer to: ${q}`);
  });

  it('bypasses translation for en', async () => {
    const translateMock = vi.spyOn(factory, 'translateWithFallback');
    
    const res = await processQuery('Hello world', 'en', 'test_module');
    
    expect(translateMock).not.toHaveBeenCalled();
    expect(res.english_query).toBe('Hello world');
    expect(res.english_answer).toBe('Answer to: Hello world');
    expect(res.native_answer).toBe('Answer to: Hello world');
    expect(res.translation_failed).toBe(false);
  });

  it('translates both ways for non-en', async () => {
    const translateMock = vi.spyOn(factory, 'translateWithFallback')
      .mockImplementation(async (text, from, to) => {
        if (to === 'en') return { translated: 'Translated In', usedFallback: false, provider: 'mock' };
        return { translated: 'Translated Out', usedFallback: false, provider: 'mock' };
      });
      
    const res = await processQuery('Native text', 'hi', 'test_module');
    
    expect(translateMock).toHaveBeenCalledTimes(2);
    expect(res.english_query).toBe('Translated In');
    expect(res.english_answer).toBe('Answer to: Translated In');
    expect(res.native_answer).toBe('Translated Out');
    expect(res.translation_failed).toBe(false);
  });

  it('throws on translate-in failure', async () => {
    vi.spyOn(factory, 'translateWithFallback').mockRejectedValue(new TranslationUnavailableError('Failed'));
    
    await expect(processQuery('Native text', 'hi', 'test_module')).rejects.toThrow(TranslationUnavailableError);
  });

  it('returns english with translation_failed=true on translate-out failure', async () => {
    vi.spyOn(factory, 'translateWithFallback').mockImplementation(async (text, from, to) => {
      if (to === 'en') return { translated: 'Eng Query', usedFallback: false };
      throw new TranslationUnavailableError('Out failed');
    });

    const res = await processQuery('Native', 'hi', 'test_module');
    
    expect(res.english_answer).toBe('Answer to: Eng Query');
    expect(res.native_answer).toBe('Answer to: Eng Query');
    expect(res.translation_failed).toBe(true);
  });

  it('returns module_not_ready for unregistered module', async () => {
    vi.spyOn(factory, 'translateWithFallback').mockResolvedValue({ translated: 'Eng', usedFallback: false });
    const res = await processQuery('text', 'hi', 'unknown_module');
    
    expect(res.status).toBe('module_not_ready');
    expect(res.english_answer).toBe('');
  });
});
