import React from 'react';
import { Mic, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import './MicButton.css';

/**
 * Aesthetic Glowing Mic Button
 * @param {string} state - 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
 * @param {function} onClick - click handler
 * @param {string} size - 'hero' | 'nav' | 'compact'
 * @param {string} label - accessible label
 */
export default function MicButton({ 
  state = 'idle', 
  onClick, 
  size = 'hero',
  label = ''
}) {
  let Icon = Mic;
  let statusText = label || 'Tap to speak';

  if (state === 'listening') {
    Icon = Mic;
    statusText = 'Listening... Speak now';
  } else if (state === 'processing') {
    Icon = Loader2;
    statusText = 'Analyzing query...';
  } else if (state === 'speaking') {
    Icon = Volume2;
    statusText = 'Explaining answer...';
  } else if (state === 'error') {
    Icon = AlertCircle;
    statusText = 'Tap to retry';
  }

  return (
    <div className={`mic-container ${size}-size state-${state}`}>
      {/* Visual Ripple Waves when listening or idle */}
      <div className={`mic-aura-ring ring-1 ${state}`}></div>
      <div className={`mic-aura-ring ring-2 ${state}`}></div>
      {state === 'listening' && <div className="mic-aura-ring ring-3 listening"></div>}

      <button 
        type="button"
        className={`mic-button ${state} ${size}`}
        onClick={onClick}
        aria-label={statusText}
        title={statusText}
      >
        <span className="mic-inner-gloss"></span>
        <Icon className={`mic-icon ${state === 'processing' ? 'icon-spin' : ''} ${state === 'listening' ? 'icon-pulse' : ''}`} />
      </button>

      {/* Audio Soundwaves visualization when speaking */}
      {state === 'speaking' && (
        <div className="mic-audio-bars">
          <span className="bar bar-1"></span>
          <span className="bar bar-2"></span>
          <span className="bar bar-3"></span>
          <span className="bar bar-4"></span>
        </div>
      )}
    </div>
  );
}
