import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import MicButton from '../components/MicButton';

export default function ProfilePage() {
  const [micState, setMicState] = useState('idle');
  const [formData, setFormData] = useState({
    age: '',
    occupation: '',
    employment_type: 'daily_wage',
    income_band: 'below_1L',
    dependents: '0'
  });

  const handleMicClick = () => {
    if (micState === 'idle') setMicState('listening');
    else if (micState === 'listening') setMicState('error');
    else setMicState('idle');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>
          <User size={32} color="#111111" aria-hidden="true" />
          <span>Profile</span>
        </h1>
        <p>Tell us about yourself for tailored schemes</p>
      </header>

      <main className="page-content">
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="field-group">
            <label htmlFor="profile-age" className="field-label">Age</label>
            <input 
              id="profile-age"
              name="age"
              type="number" 
              inputMode="numeric"
              className="input-control" 
              placeholder="e.g. 35"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label htmlFor="profile-occupation" className="field-label">Occupation</label>
            <input 
              id="profile-occupation"
              name="occupation"
              type="text" 
              className="input-control" 
              placeholder="e.g. Construction worker, Farmer"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label htmlFor="profile-employment" className="field-label">Employment Type</label>
            <select 
              id="profile-employment"
              name="employment_type"
              className="input-control"
              value={formData.employment_type}
              onChange={handleChange}
            >
              <option value="daily_wage">Daily Wage Worker</option>
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self Employed / Vendor</option>
              <option value="agricultural">Agricultural Laborer</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="profile-income-band" className="field-label">Annual Income Band</label>
            <select 
              id="profile-income-band"
              name="income_band"
              className="input-control"
              value={formData.income_band}
              onChange={handleChange}
            >
              <option value="below_1L">Below ₹1,00,000</option>
              <option value="1L_to_2.5L">₹1,00,000 – ₹2,50,000</option>
              <option value="2.5L_to_5L">₹2,50,000 – ₹5,00,000</option>
              <option value="above_5L">Above ₹5,00,000</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="profile-dependents" className="field-label">Number of Dependents</label>
            <input 
              id="profile-dependents"
              name="dependents"
              type="number" 
              inputMode="numeric"
              className="input-control" 
              placeholder="e.g. 3"
              value={formData.dependents}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ backgroundColor: '#111111', color: '#ffffff' }}
            aria-label="Save profile details"
          >
            <Save size={24} aria-hidden="true" />
            <span>Save Profile</span>
          </button>
        </form>
      </main>

      <footer className="mic-section">
        <MicButton state={micState} onClick={handleMicClick} />
      </footer>
    </div>
  );
}
