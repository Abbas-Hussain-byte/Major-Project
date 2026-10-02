import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Send, Sparkles, Volume2, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import MicButton from '../components/MicButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../services/speech/useVoice';
import './LiteracyPage.css';

const QUICK_TOPICS = [
  { label: 'What is PMJJBY?', query: 'What is PMJJBY and what does it cover?' },
  { label: 'No-KYC Bank Account?', query: 'Can I open a bank account without full KYC documents?' },
  { label: 'How does PMSBY work?', query: 'What is PMSBY and how much is the premium?' },
  { label: 'Is UPI safe to use?', query: 'What is UPI and how do I protect my PIN?' }
];

export default function LiteracyPage() {
  const [searchParams] = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language || 'en');
  const [question, setQuestion] = useState('');

  const {
    micState,
    errorMsg,
    lastQuery,
    lastAnswer,
    sources,
    responseStatus,
    isSpeaking,
    startListening,
    askText,
    replaySpeech,
    stop
  } = useVoice({ lang: selectedLang, moduleName: 'literacy' });

  // Auto-listen if routed with ?autostart=1
  useEffect(() => {
    if (searchParams.get('autostart') === '1') {
      startListening();
    }
  }, [searchParams]);

  const handleLanguageSelect = (langCode) => {
    setSelectedLang(langCode);
    if (setLanguage) setLanguage(langCode);
  };

  const handleMicClick = () => {
    if (micState === 'listening' || micState === 'processing') stop();
    else startListening();
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || micState === 'processing') return;
    const q = question;
    setQuestion('');
    try {
      await askText(q);
    } catch {
      // Handled inside useVoice
    }
  };

  const handleQuickTopic = async (queryText) => {
    setQuestion('');
    try {
      await askText(queryText);
    } catch {
      // Handled inside useVoice
    }
  };

  return (
    <div className="page-container literacy-page">
      {/* Header */}
      <header className="page-header">
        <h1>
          <BookOpen size={36} className="header-icon" aria-hidden="true" />
          <span>Financial Literacy</span>
        </h1>
        <p>Grounded advice on micro-insurance, banking rights, and government schemes</p>

        {/* Language selector toggle */}
        <div className="language-selector-bar" role="group" aria-label="Select preferred voice language">
          <button 
            type="button" 
            className={`lang-btn ${selectedLang === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageSelect('en')}
          >
            English
          </button>
          <button 
            type="button" 
            className={`lang-btn ${selectedLang === 'hi' ? 'active' : ''}`}
            onClick={() => handleLanguageSelect('hi')}
          >
            हिंदी (Hindi)
          </button>
          <button 
            type="button" 
            className={`lang-btn ${selectedLang === 'te' ? 'active' : ''}`}
            onClick={() => handleLanguageSelect('te')}
          >
            తెలుగు (Telugu)
          </button>
        </div>
      </header>

      <main className="page-content">
        {/* Hero Interactive Voice Section */}
        <section className="literacy-hero-card" aria-label="Voice input section">
          <div className="mic-interactive-wrapper">
            <MicButton 
              size="hero" 
              state={micState} 
              onClick={handleMicClick} 
              label={`Tap to speak in ${selectedLang === 'te' ? 'Telugu' : selectedLang === 'hi' ? 'Hindi' : 'English'}`}
            />
          </div>

          <div className="status-banner" aria-live="polite">
            {micState === 'listening' && (
              <div className="status-pill listening">
                <span className="live-dot"></span>
                <span>Listening in {selectedLang === 'te' ? 'Telugu' : selectedLang === 'hi' ? 'Hindi' : 'English'}... Speak now</span>
              </div>
            )}
            {micState === 'processing' && (
              <div className="status-pill processing">
                <span className="spinner-mini"></span>
                <span>Searching official government guidelines...</span>
              </div>
            )}
            {micState === 'speaking' && (
              <div className="status-pill speaking">
                <Volume2 size={16} />
                <span>Reading explanation aloud...</span>
              </div>
            )}
            {micState === 'idle' && (
              <p className="idle-instruction">
                Tap the microphone to speak your question, or choose from common questions below.
              </p>
            )}
            {micState === 'error' && (
              <div className="status-pill error">
                <AlertCircle size={16} />
                <span>{errorMsg || 'Audio input error. Please try typing below.'}</span>
              </div>
            )}
          </div>
        </section>

        {/* Answer Card */}
        {lastAnswer && (
          <section className="answer-card" aria-live="polite">
            {lastQuery && (
              <div className="query-quote">
                <strong>Your question:</strong> "{lastQuery}"
              </div>
            )}

            <div className="answer-text">
              <p>{lastAnswer}</p>
            </div>

            <div className="answer-meta">
              <div className="grounded-badge">
                <ShieldCheck size={16} />
                <span>Strictly Grounded in Official Corpus</span>
              </div>

              <button 
                type="button" 
                className="btn-replay" 
                onClick={replaySpeech}
                disabled={isSpeaking}
                aria-label="Replay spoken answer"
              >
                <Volume2 size={18} />
                <span>{isSpeaking ? 'Speaking...' : 'Listen Again'}</span>
              </button>
            </div>

            {sources && sources.length > 0 && (
              <div className="sources-container">
                <span className="sources-title">Verified Official References:</span>
                <div className="sources-grid">
                  {sources.map((src, i) => (
                    <div key={i} className="source-item">
                      <span className="source-bullet">✓</span>
                      <span className="source-name">{src.title}</span>
                      {src.topic && <span className="source-topic">({src.topic})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Quick Question Chips */}
        <section className="quick-topics-section">
          <h3>Quick Questions</h3>
          <div className="quick-chips-grid">
            {QUICK_TOPICS.map((topic, i) => (
              <button 
                key={i} 
                type="button" 
                className="quick-chip"
                onClick={() => handleQuickTopic(topic.query)}
                disabled={micState === 'processing'}
              >
                <span>{topic.label}</span>
                <ArrowRight size={14} className="chip-arrow" />
              </button>
            ))}
          </div>
        </section>

        {/* Type Question Fallback Bar */}
        <section className="type-fallback-section">
          <form className="chat-input-form" onSubmit={handleTextSubmit}>
            <input 
              type="text" 
              className="chat-text-input"
              placeholder={micState === 'listening' ? 'Listening to voice...' : 'Type any question (e.g. How does PMSBY work?)'}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={micState === 'processing'}
              aria-label="Type your question"
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!question.trim() || micState === 'processing'}
              aria-label="Send question"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
