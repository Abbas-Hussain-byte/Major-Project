import mongoose from 'mongoose';

/**
 * LiteracyContent — reference corpus for the Financial Literacy Tutor.
 * Embeddings are NOT stored inline; they are managed via EmbeddingService /
 * RetrievalService so the vector backend is swappable.
 */
const literacyContentSchema = new mongoose.Schema(
  {
    source_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KnowledgeSource',
      required: true,
    },
    title: { type: String, required: true },
    topic: {
      type: String,
      enum: ['savings', 'insurance', 'loans', 'credit', 'upi', 'general'],
      required: true,
    },
    content_text: { type: String, required: true },
    language: { type: String, default: 'en' }, // stored in English; translated on demand
    last_updated: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

literacyContentSchema.index({ topic: 1 });
literacyContentSchema.index({ source_id: 1 });

export default mongoose.model('LiteracyContent', literacyContentSchema);
