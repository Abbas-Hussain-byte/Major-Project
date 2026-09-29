import React, { useState } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import MicButton from '../components/MicButton';

export default function EligibilityPage() {
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
          <Shield size={32} color="#111111" aria-hidden="true" />
          <span>Benefits & Protection</span>
        </h1>
        <p>Government schemes and micro-insurance you qualify for</p>
      </header>

      <main className="page-content">
        <section aria-label="Benefits list" className="empty-state-box">
          <Shield size={48} color="#999999" aria-hidden="true" />
          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-dark)' }}>No benefits checked yet</h2>
          <p>Tap the button below or use voice to discover government schemes and insurance you qualify for.</p>
        </section>

        <button 
          type="button" 
          className="btn-primary btn-eligibility"
          aria-label="Check my benefits"
        >
          <Sparkles size={24} aria-hidden="true" />
          <span>Check my benefits</span>
        </button>
      </main>

      <footer className="mic-section">
        <MicButton state={micState} onClick={handleMicClick} />
      </footer>
    </div>
  );
}
