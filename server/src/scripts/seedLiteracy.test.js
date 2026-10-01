import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { seed } from './seedLiteracy.js';
import mongoose from 'mongoose';
import KnowledgeSource from '../models/KnowledgeSource.js';
import LiteracyContent from '../models/LiteracyContent.js';
import { embed } from '../services/embeddings/embeddingService.js';
import fs from 'fs';

vi.mock('mongoose', () => ({
  default: { connect: vi.fn() }
}));
vi.mock('../models/KnowledgeSource.js', () => ({
  default: { findOne: vi.fn(), create: vi.fn() }
}));
vi.mock('../models/LiteracyContent.js', () => ({
  default: { findOne: vi.fn(), create: vi.fn() }
}));
vi.mock('../services/embeddings/embeddingService.js');
vi.mock('fs');

describe('seedLiteracy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is idempotent and skips embedding if length is already 256', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([
      { source_url: 'u1', title: 't1', topic: 'general', content_text: 'c1', organization: 'org1' }
    ]));
    
    KnowledgeSource.findOne.mockResolvedValue({ _id: 'source1', source_url: 'u1' });
    
    const mockSave = vi.fn().mockResolvedValue();
    const mockDoc = { _id: 'doc1', embedding: new Array(256).fill(0.1), save: mockSave };
    
    LiteracyContent.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockDoc)
    });
    
    await seed();
    
    expect(embed).not.toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
  });

  it('calls embed if embedding is missing or wrong length', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([
      { source_url: 'u1', title: 't1', topic: 'general', content_text: 'c1', organization: 'org1' }
    ]));
    
    KnowledgeSource.findOne.mockResolvedValue({ _id: 'source1', source_url: 'u1' });
    
    const mockSave = vi.fn().mockResolvedValue();
    const mockDoc = { _id: 'doc1', embedding: [], save: mockSave }; // wrong length
    
    LiteracyContent.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockDoc)
    });
    
    embed.mockResolvedValue(new Array(256).fill(0.2));
    
    await seed();
    
    expect(embed).toHaveBeenCalledWith('c1', 'RETRIEVAL_DOCUMENT');
    expect(mockDoc.embedding).toHaveLength(256);
    expect(mockSave).toHaveBeenCalled();
  });
});
