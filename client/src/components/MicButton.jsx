import React from 'react';
import { Mic, Loader2, AlertCircle } from 'lucide-react';
import './MicButton.css';

/**
 * 
 * @param {string} state - 'idle', 'listening', or 'error'
 * @param {function} onClick - handler
 */
export default function MicButton({ state = 'idle', onClick }) {
  let Icon = Mic;
  let statusText = 'Ready to listen. Tap to speak.';
  
  if (state === 'listening') {
    Icon = Loader2;
    statusText = 'Listening... Please speak now.';
  } else if (state === 'error') {
    Icon = AlertCircle;
    statusText = 'Error understanding audio. Please tap to try again.';
  }

  return (
    <div className="mic-container">
      {/* Live region for screen readers to announce status changes */}
      <div aria-live="polite" className="sr-only">
        {statusText}
      </div>
      
      <button 
        className={`mic-button ${state}`}
        onClick={onClick}
        aria-label={statusText}
      >
        <Icon size={64} color="#111111" />
      </button>
    </div>
  );
}
