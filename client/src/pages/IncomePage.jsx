import React, { useState } from 'react';
import { Coins, ArrowDownCircle, ArrowUpCircle, Check } from 'lucide-react';
import MicButton from '../components/MicButton';

export default function IncomePage() {
  const [entryType, setEntryType] = useState('income'); // 'income' or 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [micState, setMicState] = useState('idle');

  const handleMicClick = () => {
    if (micState === 'idle') setMicState('listening');
    else if (micState === 'listening') setMicState('error');
    else setMicState('idle');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>
          <Coins size={32} color="var(--color-income-bg)" aria-hidden="true" />
          <span>Income & Expenses</span>
        </h1>
        <p>Record your daily transactions</p>
      </header>

      <main className="page-content">
        <div className="toggle-group" role="group" aria-label="Transaction type">
          <button 
            type="button"
            className={`toggle-btn ${entryType === 'income' ? 'active' : ''}`}
            onClick={() => setEntryType('income')}
            aria-pressed={entryType === 'income'}
          >
            <ArrowDownCircle size={24} aria-hidden="true" />
            <span>Income</span>
          </button>
          <button 
            type="button"
            className={`toggle-btn ${entryType === 'expense' ? 'active' : ''}`}
            onClick={() => setEntryType('expense')}
            aria-pressed={entryType === 'expense'}
          >
            <ArrowUpCircle size={24} aria-hidden="true" />
            <span>Expense</span>
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="page-content" style={{ gap: '16px' }}>
          <div className="field-group">
            <label htmlFor="transaction-amount" className="field-label">
              Amount (₹)
            </label>
            <input 
              id="transaction-amount"
              type="number" 
              inputMode="numeric"
              className="input-control" 
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="transaction-category" className="field-label">
              Category
            </label>
            <input 
              id="transaction-category"
              type="text" 
              className="input-control" 
              placeholder="e.g. Daily wage, Groceries"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-income"
            aria-label={`Save ${entryType}`}
          >
            <Check size={24} aria-hidden="true" />
            <span>Save {entryType === 'income' ? 'Income' : 'Expense'}</span>
          </button>
        </form>
      </main>

      <footer className="mic-section">
        <MicButton state={micState} onClick={handleMicClick} />
      </footer>
    </div>
  );
}
