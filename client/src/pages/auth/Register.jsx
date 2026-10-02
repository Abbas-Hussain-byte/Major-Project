import React, { useState } from 'react';
import { Phone, UserPlus, Shield, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!phone) return;
    localStorage.setItem('benefitlens_token', 'mock_token_' + phone);
    navigate('/');
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div className="glass-panel" style={{ padding: '36px 32px' }}>
        <header className="page-header" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px' }}>
            <UserPlus size={28} className="glow-cyan" aria-hidden="true" />
            <span>Create Account</span>
          </h1>
          <p style={{ fontSize: '15px' }}>Register to unlock personalized scheme eligibility</p>
        </header>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="field-group" style={{ marginBottom: 0 }}>
            <label htmlFor="register-phone" className="field-label">Mobile Number</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                id="register-phone"
                type="tel" 
                inputMode="tel"
                className="input-control" 
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '44px' }}
                aria-label="Mobile Number"
                required
              />
              <Phone size={18} color="#818cf8" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} aria-hidden="true" />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
            aria-label="Register account"
          >
            <span>Create Citizen Profile</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#38bdf8', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
