/**
 * RetrievalService — semantic search over LiteracyContent and Scheme corpora.
 * Uses EmbeddingService for vector generation and cosine similarity for ranking.
 *
 * Production path: swap cosineSimilarity ranking for MongoDB Atlas Vector Search
 * by replacing the rankBySimilarity function — no other code needs to change.
 */
import LiteracyContent from '../../models/LiteracyContent.js';
import { embed, cosineSimilarity } from './embeddingService.js';

/**
 * Retrieve top-k LiteracyContent chunks relevant to a query.
 * @param {string} query - English-language query text
 * @param {number} topK
 * @returns {Promise<Array<{content: object, score: number}>>}
 */
export const retrieveLiteracyChunks = async (query, topK = 5) => {
  const queryVec = await embed(query);

  // Dev/stub mode: load all docs and rank in-memory
  // TODO: replace with Atlas Vector Search aggregation pipeline in production
  const allDocs = await LiteracyContent.find({}).lean();

  if (allDocs.length === 0) return [];

  // If embeddings aren't stored yet, fall back to keyword match
  const scored = allDocs.map((doc) => ({
    content: doc,
    score: doc.embedding
      ? cosineSimilarity(queryVec, doc.embedding)
      : (doc.content_text.toLowerCase().includes(query.toLowerCase()) ? 0.5 : 0),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((r) => r.score > 0);
};
