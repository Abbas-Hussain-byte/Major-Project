import mongoose from 'mongoose';

const eligibilityMatchSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scheme_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
    },
    matched_at: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['notified', 'enrolled', 'dismissed'],
      default: 'notified',
    },
  },
  { timestamps: false }
);

eligibilityMatchSchema.index({ user_id: 1, scheme_id: 1 }, { unique: true });
eligibilityMatchSchema.index({ user_id: 1, status: 1 });

export default mongoose.model('EligibilityMatch', eligibilityMatchSchema);
