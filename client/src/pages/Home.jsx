import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import MicButton from '../components/MicButton';
import { useVoice } from '../services/speech/useVoice';
import './Home.css';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  
  const moduleName = import.meta.env.VITE_VOICE_ECHO === 'true' ? 'echo' : 'home';
  const { micState, errorMsg, lastAnswer, startListening, stop } = useVoice({ lang: language, moduleName });
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleMicClick = () => {
    if (micState === 'listening' || micState === 'processing') {
      stop();
    } else {
      startListening(() => setShowTextFallback(true));
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    // Handled in full implementation, for now just show we received it
    console.log('Text fallback submitted:', textInput);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>BenefitLens</h1>
        <p>Select your language / భాషను ఎంచుకోండి / अपनी भाषा चुनें</p>
      </header>

      <div className="language-selector">
        <button 
          className={`lang-button ${language === 'te' ? 'active' : ''}`}
          onClick={() => setLanguage('te')}
          aria-pressed={language === 'te'}
        >
          తెలుగు
        </button>
        <button 
          className={`lang-button ${language === 'hi' ? 'active' : ''}`}
          onClick={() => setLanguage('hi')}
          aria-pressed={language === 'hi'}
        >
          हिन्दी
        </button>
      </div>

      <div className="mic-section">
        <MicButton state={micState} onClick={handleMicClick} />
        {errorMsg && <p className="error-msg" aria-live="polite">{errorMsg}</p>}
        {lastAnswer && <p className="answer-msg" aria-live="polite">{lastAnswer}</p>}
        
        {showTextFallback && (
          <form className="text-fallback-form" onSubmit={handleTextSubmit}>
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your question..."
              aria-label="Text fallback input"
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}
