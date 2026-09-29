import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import MicButton from '../components/MicButton';
import './Home.css';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [micState, setMicState] = useState('idle');

  const handleMicClick = () => {
    if (micState === 'idle') setMicState('listening');
    else if (micState === 'listening') setMicState('error');
    else setMicState('idle');
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
      </div>
    </div>
  );
}
