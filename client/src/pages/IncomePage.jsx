import React, { useState, useEffect } from 'react';
import { Coins, ArrowDownCircle, ArrowUpCircle, Check, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './IncomePage.css';

export default function IncomePage() {
  const { t } = useLanguage();
  const [entryType, setEntryType] = useState('income'); // 'income' or 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('benefitlens_transactions');
      return saved ? JSON.parse(saved) : [
        { id: '1', type: 'income', amount: 800, category: 'Daily Construction Wage', date: 'Today' },
        { id: '2', type: 'expense', amount: 250, category: 'Groceries & Provisions', date: 'Yesterday' }
      ];
    } catch {
      return [];
    }
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('benefitlens_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    const newTx = {
      id: Date.now().toString(),
      type: entryType,
      amount: parseFloat(amount),
      category: category.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    setTransactions([newTx, ...transactions]);
    setAmount('');
    setCategory('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="page-container income-page">
      {/* Header — Tagline badge removed as requested */}
      <header className="page-header">
        <h1>
          <Coins size={36} className="glow-cyan" aria-hidden="true" />
          <span>{t('cashflow_title')}</span>
        </h1>
        <p>{t('cashflow_subtitle')}</p>
      </header>

      {/* Summary Cards */}
      <div className="cashflow-summary-grid">
        <div className="cashflow-stat-card income">
          <div className="stat-icon-pod">
            <TrendingUp size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('cashflow_inflow')}</span>
            <span className="stat-value">₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="cashflow-stat-card expense">
          <div className="stat-icon-pod">
            <TrendingDown size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('cashflow_outflow')}</span>
            <span className="stat-value">₹{totalExpense.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="cashflow-stat-card balance">
          <div className="stat-icon-pod">
            <Coins size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('cashflow_surplus')}</span>
            <span className={`stat-value ${netBalance >= 0 ? 'positive' : 'negative'}`}>
              ₹{netBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <main className="income-main-content">
        {/* Entry Form Card */}
        <section className="income-form-card">
          <h2 className="card-title">{t('cashflow_add_tx')}</h2>

          <div className="toggle-group" role="group" aria-label="Transaction type">
            <button 
              type="button"
              className={`toggle-btn income-btn ${entryType === 'income' ? 'active' : ''}`}
              onClick={() => setEntryType('income')}
              aria-pressed={entryType === 'income'}
            >
              <ArrowDownCircle size={18} aria-hidden="true" />
              <span>{t('cashflow_income_tab')}</span>
            </button>
            <button 
              type="button"
              className={`toggle-btn expense-btn ${entryType === 'expense' ? 'active' : ''}`}
              onClick={() => setEntryType('expense')}
              aria-pressed={entryType === 'expense'}
            >
              <ArrowUpCircle size={18} aria-hidden="true" />
              <span>{t('cashflow_expense_tab')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="entry-form">
            <div className="field-group">
              <label htmlFor="transaction-amount" className="field-label">
                {t('cashflow_amount_label')}
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">₹</span>
                <input 
                  id="transaction-amount"
                  type="number" 
                  inputMode="numeric"
                  className="input-control has-prefix" 
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="transaction-category" className="field-label">
                {t('cashflow_desc_label')}
              </label>
              <input 
                id="transaction-category"
                type="text" 
                className="input-control" 
                placeholder="e.g. Daily wage, Tea stall supplies, Transport"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className={`btn-primary ${entryType === 'income' ? 'btn-save-income' : 'btn-save-expense'}`}
              aria-label={`Save ${entryType}`}
            >
              {savedSuccess ? (
                <>
                  <Check size={20} />
                  <span>{t('cashflow_saved_success')}</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>{entryType === 'income' ? t('cashflow_save_income') : t('cashflow_save_expense')}</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Recent Transactions List */}
        <section className="transactions-list-card">
          <h2 className="card-title">{t('cashflow_recent_tx')}</h2>

          {transactions.length === 0 ? (
            <div className="empty-tx-box">
              <p>{t('cashflow_empty')}</p>
            </div>
          ) : (
            <div className="tx-items-grid">
              {transactions.map(tx => (
                <div key={tx.id} className={`tx-item ${tx.type}`}>
                  <div className="tx-type-indicator">
                    {tx.type === 'income' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                  </div>

                  <div className="tx-details">
                    <span className="tx-category">{tx.category}</span>
                    <span className="tx-date">{tx.date}</span>
                  </div>

                  <div className="tx-amount-group">
                    <span className="tx-amount">
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <button 
                      type="button" 
                      className="btn-delete-tx" 
                      onClick={() => handleDelete(tx.id)}
                      title="Delete transaction"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
