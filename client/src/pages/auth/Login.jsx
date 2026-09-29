import React, { useState } from 'react';
import { Phone, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>
          <LogIn size={32} color="#111111" aria-hidden="true" />
          <span>Login</span>
        </h1>
        <p>Enter your mobile number to continue</p>
      </header>

      <main className="page-content">
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="field-group">
            <label htmlFor="login-phone" className="field-label">Mobile Number</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                id="login-phone"
                type="tel"
                inputMode="tel"
                className="input-control" 
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '48px' }}
                aria-label="Mobile Number"
              />
              <Phone size={24} color="#666666" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} aria-hidden="true" />
            </div>
          </div>

          <button 
            type="button" 
            className="btn-primary btn-eligibility"
            aria-label="Continue with mobile number"
          >
            <LogIn size={24} aria-hidden="true" />
            <span>Continue</span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#666666' }}>
          New user? <Link to="/register" style={{ color: 'var(--color-documents-bg)', fontWeight: 'bold' }}>Register here</Link>
        </p>
      </main>
    </div>
  );
}
