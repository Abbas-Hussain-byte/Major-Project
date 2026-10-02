import React, { useState, useEffect } from 'react';
import { X, Volume2, Send, Sparkles, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import MicButton from './MicButton';
import { useVoice } from '../services/speech/useVoice';
import { useLanguage } from '../contexts/LanguageContext';
import './VoiceAssistantModal.css';

export default function VoiceAssistantModal({ isOpen, onClose }) {
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language || 'en');
  const [inputText, setInputText] = useState('');

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

  // Auto-listen when opened
  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stop();
    }
  }, [isOpen]);

  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    if (setLanguage) setLanguage(langCode);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || micState === 'processing') return;
    const text = inputText;
    setInputText('');
    await askText(text);
  };

  const handleQuickQuestion = async (q) => {
    setInputText('');
    await askText(q);
  };

  if (!isOpen) return null;

  return (
    <div className="voice-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="BenefitLens Voice Assistant">
      <div className="voice-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="voice-modal-header">
          <div className="voice-modal-title">
            <Sparkles size={20} className="glow-icon" />
            <span>Voice Financial Assistant</span>
          </div>

          {/* Language selector chips */}
          <div className="lang-switcher" aria-label="Select voice language">
            <button 
              type="button"
              className={`lang-chip ${selectedLang === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </button>
            <button 
              type="button"
              className={`lang-chip ${selectedLang === 'hi' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('hi')}
            >
              हिंदी
            </button>
            <button 
              type="button"
              className={`lang-chip ${selectedLang === 'te' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('te')}
            >
              తెలుగు
            </button>
          </div>

          <button type="button" className="voice-modal-close" onClick={onClose} aria-label="Close Assistant">
            <X size={20} />
          </button>
        </div>

        {/* Central Audio & Orb Section */}
        <div className="voice-orb-section">
          <MicButton 
            size="hero" 
            state={micState} 
            onClick={() => {
              if (micState === 'listening' || micState === 'processing') stop();
              else startListening();
            }}
          />

          <div className="voice-status-caption" aria-live="polite">
            {micState === 'listening' && (
              <span className="caption-text listening">
                Listening in {selectedLang === 'te' ? 'Telugu' : selectedLang === 'hi' ? 'Hindi' : 'English'}... Speak now
              </span>
            )}
            {micState === 'processing' && (
              <span className="caption-text processing">
                Searching official government scheme database...
              </span>
            )}
            {micState === 'speaking' && (
              <span className="caption-text speaking">
                Explaining answer aloud...
              </span>
            )}
            {micState === 'idle' && !lastAnswer && (
              <span className="caption-text idle">
                Tap microphone to ask any question about insurance, loans, or savings
              </span>
            )}
            {micState === 'error' && (
              <span className="caption-text error">
                <AlertCircle size={16} /> {errorMsg || 'Tap mic to try again'}
              </span>
            )}
          </div>
        </div>

        {/* Answer Display */}
        {lastAnswer && (
          <div className="voice-response-card">
            {lastQuery && (
              <div className="voice-query-pill">
                <strong>You asked:</strong> "{lastQuery}"
              </div>
            )}

            <div className="voice-answer-body">
              <p>{lastAnswer}</p>
            </div>

            <div className="voice-response-footer">
              <div className="voice-grounding-tag">
                <ShieldCheck size={16} />
                <span>Grounded with Official Government Guidelines</span>
              </div>

              <button 
                type="button" 
                className="btn-replay-audio"
                onClick={replaySpeech}
                disabled={isSpeaking}
                aria-label="Listen to answer again"
              >
                <Volume2 size={16} />
                <span>{isSpeaking ? 'Playing...' : 'Listen Again'}</span>
              </button>
            </div>

            {sources && sources.length > 0 && (
              <div className="voice-sources-box">
                <span className="sources-label">Official Sources:</span>
                <div className="sources-list">
                  {sources.map((s, idx) => (
                    <span key={idx} className="source-chip" title={s.topic}>
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggestion Chips when idle */}
        {!lastAnswer && micState === 'idle' && (
          <div className="quick-suggestions">
            <span className="suggestions-label">Try asking:</span>
            <div className="suggestion-chips-grid">
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => handleQuickQuestion('What is PMJJBY?')}
              >
                What is PMJJBY life cover?
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => handleQuickQuestion('What is KYC and why is it needed?')}
              >
                What is KYC and why is it needed?
              </button>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => handleQuickQuestion('Can I open an account without full KYC?')}
              >
                Open account without KYC?
              </button>
            </div>
          </div>
        )}

        {/* Text Input Fallback Bar */}
        <form className="voice-text-input-bar" onSubmit={handleTextSubmit}>
          <input 
            type="text"
            className="voice-input-field"
            placeholder={micState === 'listening' ? 'Listening...' : 'Or type your question here...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={micState === 'processing'}
            aria-label="Type your question fallback"
          />
          <button 
            type="submit" 
            className="btn-send-text"
            disabled={!inputText.trim() || micState === 'processing'}
            aria-label="Send question"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
