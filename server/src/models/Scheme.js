import mongoose from 'mongoose';

/**
 * Scheme — shared reference corpus (government schemes + insurance products).
 * eligibility_criteria is read ONLY by the deterministic Rule Engine.
 * The LLM must never make eligibility decisions based on this data.
 */
const schemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['government_scheme', 'govt_insurance', 'private_insurance'],
      required: true,
    },
    /**
     * Structured eligibility fields consumed by ruleEngine.js.
     * Add new fields here as new schemes are onboarded.
     */
    eligibility_criteria: {
      age_min: { type: Number },
      age_max: { type: Number },
      income_max_band: {
        type: String,
        enum: ['below_1L', '1L_3L', '3L_5L', 'above_5L', 'any'],
        default: 'any',
      },
      occupation: [{ type: String }],       // [] means any
      employment_types: [{ type: String }], // [] means any
      max_dependents: { type: Number },
      min_dependents: { type: Number },
      custom_rules: { type: mongoose.Schema.Types.Mixed }, // extensible
    },
    benefit_description: { type: String, required: true },
    premium_annual_inr: { type: Number, default: 0 },
    coverage_inr: { type: Number },
    how_to_apply: { type: String },
    source_document_ref: { type: String },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

schemeSchema.index({ type: 1, is_active: 1 });

export default mongoose.model('Scheme', schemeSchema);
