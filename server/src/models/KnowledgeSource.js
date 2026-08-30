import mongoose from 'mongoose';

const knowledgeSourceSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      enum: ['RBI', 'NCFE', 'IRDAI', 'OTHER'],
      required: true,
    },
    source_url: { type: String, required: true },
    source_type: {
      type: String,
      enum: ['circular', 'guideline', 'faq', 'consumer_guide', 'other'],
      default: 'other',
    },
    title: { type: String },
    last_updated: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model('KnowledgeSource', knowledgeSourceSchema);
