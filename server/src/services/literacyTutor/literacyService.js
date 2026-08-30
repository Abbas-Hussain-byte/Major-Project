/**
 * LiteracyService — RAG-based financial literacy Q&A.
 *
 * Strictly grounded: if no relevant chunks are retrieved, the system
 * must say so explicitly rather than answering from general knowledge.
 * This is enforced by the system prompt and the no-results guard below.
 */
import { retrieveLiteracyChunks } from '../embeddings/retrievalService.js';
import { geminiChat } from '../llm/geminiService.js';

const SYSTEM_PROMPT = `You are a financial literacy tutor for low-income workers in India.
You ONLY answer using the source excerpts provided below.
If the excerpts do not contain enough information to answer the question,
respond with: "I don't have reliable information on that topic. Please consult
an RBI-registered financial advisor or visit your nearest Common Service Centre."
Do not add information from your general training data.
Always use simple, jargon-free language suitable for first-time learners.`;

/**
 * Answer a financial literacy question using RAG.
 * @param {string} question  - English-language question
 * @returns {Promise<{answer: string, sources: object[]}>}
 */
export const answerQuestion = async (question) => {
  const chunks = await retrieveLiteracyChunks(question, 5);

  if (chunks.length === 0) {
    return {
      answer:
        "I don't have reliable information on that topic. Please consult " +
        'an RBI-registered financial advisor or visit your nearest Common Service Centre.',
      sources: [],
    };
  }

  const context = chunks
    .map((c, i) => `[Excerpt ${i + 1}] ${c.content.title}:\n${c.content.content_text}`)
    .join('\n\n');

  const userMessage = `Source excerpts:\n${context}\n\nQuestion: ${question}`;

  const answer = await geminiChat(SYSTEM_PROMPT, userMessage);

  const sources = chunks.map((c) => ({
    content_id: c.content._id,
    title: c.content.title,
    topic: c.content.topic,
    source_id: c.content.source_id,
  }));

  return { answer, sources };
};
