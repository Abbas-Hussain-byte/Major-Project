import React, { useState } from 'react';
import { Phone, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [phone, setPhone] = useState('');

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>
          <UserPlus size={32} color="#111111" aria-hidden="true" />
          <span>Register</span>
        </h1>
        <p>Create an account with your mobile number</p>
      </header>

      <main className="page-content">
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="field-group">
            <label htmlFor="register-phone" className="field-label">Mobile Number</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                id="register-phone"
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
            aria-label="Register account"
          >
            <UserPlus size={24} aria-hidden="true" />
            <span>Register</span>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#666666' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-documents-bg)', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </main>
    </div>
  );
}
