import React, { useState } from 'react';
import { BookOpen, Send } from 'lucide-react';
import MicButton from '../components/MicButton';

export default function LiteracyPage() {
  const [micState, setMicState] = useState('idle');
  const [question, setQuestion] = useState('');

  const handleMicClick = () => {
    if (micState === 'idle') setMicState('listening');
    else if (micState === 'listening') setMicState('error');
    else setMicState('idle');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>
          <BookOpen size={32} color="var(--color-literacy-bg)" aria-hidden="true" />
          <span>Financial Literacy</span>
        </h1>
        <p>Ask any question about insurance, loans, or savings</p>
      </header>

      <main className="page-content">
        <section aria-label="Ask a question" className="empty-state-box">
          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-dark)' }}>
            Speak or type your question
          </h2>
          <p>Tap the big microphone below to ask in Telugu or Hindi, or type your question below.</p>
        </section>

        <div className="field-group">
          <label htmlFor="text-fallback-input" className="field-label">
            Type your question (optional)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              id="text-fallback-input"
              type="text" 
              className="input-control" 
              placeholder="e.g. How does PMSBY work?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              aria-label="Type your question"
            />
            <button 
              type="button" 
              className="btn-primary btn-literacy" 
              style={{ minWidth: '56px', padding: '0 16px' }}
              aria-label="Send question"
            >
              <Send size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>

      <footer className="mic-section">
        <MicButton state={micState} onClick={handleMicClick} />
      </footer>
    </div>
  );
}
