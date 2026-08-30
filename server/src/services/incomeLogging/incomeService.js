/**
 * IncomeService — income/expense logging and summary aggregation.
 * No external AI calls — DB only.
 */
import IncomeExpenseLog from '../../models/IncomeExpenseLog.js';

/**
 * Create a new log entry.
 * @param {string} userId
 * @param {{ amount: number, category: string, type: 'income'|'expense', note?: string, logged_at?: Date }} data
 */
export const createEntry = async (userId, data) => {
  const entry = await IncomeExpenseLog.create({
    user_id: userId,
    amount: data.amount,
    category: data.category,
    type: data.type,
    note: data.note,
    logged_at: data.logged_at ?? new Date(),
  });
  return entry;
};

/**
 * Aggregate weekly + monthly totals and category breakdown for a user.
 * @param {string} userId
 * @param {'weekly'|'monthly'} period
 */
export const getSummary = async (userId, period = 'monthly') => {
  const now = new Date();
  const startDate =
    period === 'weekly'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      : new Date(now.getFullYear(), now.getMonth(), 1);

  const logs = await IncomeExpenseLog.find({
    user_id: userId,
    logged_at: { $gte: startDate },
  }).lean();

  const totals = { income: 0, expense: 0 };
  const categories = {};

  for (const log of logs) {
    totals[log.type] += log.amount;
    const key = `${log.type}:${log.category}`;
    categories[key] = (categories[key] ?? 0) + log.amount;
  }

  const net = totals.income - totals.expense;

  return {
    period,
    startDate,
    endDate: now,
    totals,
    net,
    categories: Object.entries(categories).map(([key, amount]) => {
      const [type, category] = key.split(':');
      return { type, category, amount };
    }),
    entryCount: logs.length,
  };
};
