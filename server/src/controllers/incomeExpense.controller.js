import { createEntry, getSummary as getIncomeSummary } from '../services/incomeLogging/incomeService.js';

export const createLog = async (req, res) => {
  const { amount, category, type, note } = req.body;
  if (!amount || !category || !type) {
    return res.status(400).json({ message: 'amount, category and type are required' });
  }

  const entry = await createEntry(req.user._id, { amount, category, type, note });
  res.status(201).json(entry);
};

export const getSummary = async (req, res) => {
  const { period } = req.query; // 'weekly' or 'monthly'
  const summary = await getIncomeSummary(req.user._id, period);
  res.json(summary);
};
