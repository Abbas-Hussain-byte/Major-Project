import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { embed, cosineSimilarity } from './embeddingService.js';
import * as geminiService from '../llm/geminiService.js';

vi.mock('../llm/geminiService.js');

describe('embeddingService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('embed', () => {
    it('calls geminiEmbed with text and taskType', async () => {
      geminiService.geminiEmbed.mockResolvedValue([0.1, 0.2]);
      const result = await embed('test text', 'RETRIEVAL_QUERY');
      expect(geminiService.geminiEmbed).toHaveBeenCalledWith('test text', 'RETRIEVAL_QUERY');
      expect(result).toEqual([0.1, 0.2]);
    });
  });

  describe('cosineSimilarity', () => {
    it('returns 0 for different length vectors', () => {
      expect(cosineSimilarity([1], [1, 2])).toBe(0);
    });

    it('calculates exact similarity for identical vectors', () => {
      expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
    });

    it('calculates similarity for orthogonal vectors', () => {
      expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
    });

    it('calculates similarity for opposite vectors', () => {
      expect(cosineSimilarity([1, 0], [-1, 0])).toBe(-1);
    });
  });
});
