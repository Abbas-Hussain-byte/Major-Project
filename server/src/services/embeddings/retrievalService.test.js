import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { retrieveLiteracyChunks } from './retrievalService.js';
import LiteracyContent from '../../models/LiteracyContent.js';
import { embed, cosineSimilarity } from './embeddingService.js';
import { ENV } from '../../config/env.js';

vi.mock('../../models/LiteracyContent.js');
vi.mock('./embeddingService.js');
vi.mock('../../config/env.js', () => ({
  ENV: { RETRIEVAL_MIN_SCORE: '0.3' }
}));

describe('retrievalService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array if corpus is empty', async () => {
    embed.mockResolvedValue([0.1]);
    LiteracyContent.find.mockReturnValue({ select: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }) });
    const result = await retrieveLiteracyChunks('test');
    expect(result).toEqual([]);
  });

  it('filters out chunks below threshold and returns only chunks >= threshold', async () => {
    embed.mockResolvedValue([0.1]);
    const mockDocs = [
      { _id: '1', embedding: [0.1] },
      { _id: '2', embedding: [0.1] },
      { _id: '3', embedding: [0.1] },
    ];
    
    LiteracyContent.find.mockReturnValue({ select: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(mockDocs) }) });
    
    // doc 1: 0.2 (filtered out)
    // doc 2: 0.3 (score exactly equal to the threshold, should be kept)
    // doc 3: 0.5 (kept)
    cosineSimilarity.mockImplementation((q, emb) => {
      if (emb === mockDocs[0].embedding) return 0.2;
      if (emb === mockDocs[1].embedding) return 0.3;
      if (emb === mockDocs[2].embedding) return 0.5;
    });

    const result = await retrieveLiteracyChunks('test', 5);
    
    expect(result.length).toBe(2);
    expect(result[0].score).toBe(0.5);
    expect(result[1].score).toBe(0.3); // Exactly equal is kept
  });
});
