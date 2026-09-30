import React, { useState } from 'react';
import { BookOpen, Send } from 'lucide-react';
import MicButton from '../components/MicButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../services/speech/useVoice';

export default function LiteracyPage() {
  const { language } = useLanguage();
  const { micState, errorMsg, lastAnswer, startListening, stop } = useVoice({ lang: language, moduleName: 'literacy' });
  const [question, setQuestion] = useState('');

  const handleMicClick = () => {
    if (micState === 'listening' || micState === 'processing') stop();
    else startListening();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    console.log('Text question submitted:', question);
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
          
          {errorMsg && <p className="error-msg" aria-live="polite">{errorMsg}</p>}
          {lastAnswer && <p className="answer-msg" aria-live="polite" style={{ marginTop: '16px', fontWeight: 'bold' }}>{lastAnswer}</p>}
        </section>

        <form className="field-group" onSubmit={handleTextSubmit}>
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
              type="submit" 
              className="btn-primary btn-literacy" 
              style={{ minWidth: '56px', padding: '0 16px' }}
              aria-label="Send question"
            >
              <Send size={20} aria-hidden="true" />
            </button>
          </div>
        </form>
      </main>

      <footer className="mic-section">
        <MicButton state={micState} onClick={handleMicClick} />
      </footer>
    </div>
  );
}
