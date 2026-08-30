/**
 * EmbeddingService — abstraction layer over the underlying vector backend.
 * Swap the import below to change providers without touching any calling code.
 *
 * Current backend: Gemini text-embedding-004
 */
import { geminiEmbed } from '../llm/geminiService.js';

/**
 * Generate an embedding vector for arbitrary text.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const embed = async (text) => {
  return geminiEmbed(text);
};

/**
 * Cosine similarity between two vectors.
 * Used by RetrievalService for in-memory ranking when a vector DB is not
 * available (dev / stub mode).
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number} similarity in [-1, 1]
 */
export const cosineSimilarity = (a, b) => {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};
