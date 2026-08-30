import mongoose from 'mongoose';

const incomeExpenseLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    note: { type: String, trim: true }, // optional voice-captured note
    logged_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

incomeExpenseLogSchema.index({ user_id: 1, logged_at: -1 });
incomeExpenseLogSchema.index({ user_id: 1, type: 1, logged_at: -1 });

export default mongoose.model('IncomeExpenseLog', incomeExpenseLogSchema);
