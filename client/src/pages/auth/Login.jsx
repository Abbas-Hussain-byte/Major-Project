import React, { useState } from 'react';
import { Phone, LogIn, Shield, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone) return;
    // For now mock login or set local auth
    localStorage.setItem('benefitlens_token', 'mock_token_' + phone);
    navigate('/');
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div className="glass-panel" style={{ padding: '36px 32px' }}>
        <header className="page-header" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px' }}>
            <LogIn size={28} className="glow-cyan" aria-hidden="true" />
            <span>Welcome Back</span>
          </h1>
          <p style={{ fontSize: '15px' }}>Enter your 10-digit mobile number to access benefits</p>
        </header>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="field-group" style={{ marginBottom: 0 }}>
            <label htmlFor="login-phone" className="field-label">Mobile Number</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                id="login-phone"
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
            aria-label="Continue with mobile number"
          >
            <span>Continue to Assistant</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '14px' }}>
          New to BenefitLens? <Link to="/register" style={{ color: '#38bdf8', fontWeight: 'bold' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
