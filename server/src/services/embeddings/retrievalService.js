/**
 * RetrievalService — semantic search over LiteracyContent and Scheme corpora.
 * Uses EmbeddingService for vector generation and cosine similarity for ranking.
 *
 * Production path: swap cosineSimilarity ranking for MongoDB Atlas Vector Search
 * by replacing the rankBySimilarity function — no other code needs to change.
 */
import LiteracyContent from '../../models/LiteracyContent.js';
import { embed, cosineSimilarity } from './embeddingService.js';

import { ENV } from '../../config/env.js';

/**
 * Retrieve top-k LiteracyContent chunks relevant to a query.
 * @param {string} query - English-language query text
 * @param {number} topK
 * @returns {Promise<Array<{content: object, score: number}>>}
 */
export const retrieveLiteracyChunks = async (query, topK = 5) => {
  const queryVec = await embed(query, 'RETRIEVAL_QUERY');

  // Dev/stub mode: load all docs and rank in-memory
  // TODO: replace with Atlas Vector Search aggregation pipeline in production
  const allDocs = await LiteracyContent.find({}).select('+embedding').lean();

  if (allDocs.length === 0) return [];

  const minScore = ENV.RETRIEVAL_MIN_SCORE ? parseFloat(ENV.RETRIEVAL_MIN_SCORE) : 0.3;

  const scored = allDocs
    .filter(doc => doc.embedding && doc.embedding.length > 0)
    .map((doc) => ({
      content: doc,
      score: cosineSimilarity(queryVec, doc.embedding),
    }));

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.score >= minScore)
    .slice(0, topK);
};
