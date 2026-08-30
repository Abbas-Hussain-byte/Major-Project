import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: { type: Number, min: 0, max: 120 },
    income_band: {
      type: String,
      enum: ['below_1L', '1L_3L', '3L_5L', 'above_5L'],
    },
    occupation: { type: String, trim: true },
    employment_type: {
      type: String,
      enum: ['gig_worker', 'street_vendor', 'daily_wage', 'other_unorganised'],
    },
    dependents: { type: Number, default: 0, min: 0 },
    existing_coverage: [{ type: String }], // scheme/policy identifiers
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Profile', profileSchema);
