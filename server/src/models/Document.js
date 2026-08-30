import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    document_type: {
      type: String,
      enum: ['insurance_policy', 'government_scheme', 'KYC', 'loan_agreement', 'card_tnc'],
      required: true,
    },
    original_filename: { type: String },
    file_path: { type: String }, // server-local path; never expose raw path to client
    mime_type: { type: String },
    extracted_text: { type: String },
    plain_language_summary: { type: String },
    risk_flags: { type: mongoose.Schema.Types.Mixed, default: [] }, // JSON array
    claim_checklist: [{ type: String }],
    uploaded_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

documentSchema.index({ user_id: 1, uploaded_at: -1 });

export default mongoose.model('Document', documentSchema);
