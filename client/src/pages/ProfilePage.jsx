import React, { useState, useEffect } from 'react';
import { User, Save, Check, Shield, AlertCircle, Globe } from 'lucide-react';
import { profileService } from '../api/services';
import { useLanguage } from '../contexts/LanguageContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    age: '',
    occupation: '',
    employment_type: 'daily_wage',
    income_band: 'below_1L',
    dependents: '0',
    has_bank_account: 'true'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
        if (response.data) {
          setFormData({
            age: response.data.age || '',
            occupation: response.data.occupation || '',
            employment_type: response.data.employment_type || 'daily_wage',
            income_band: response.data.income_band || 'below_1L',
            dependents: response.data.dependents?.toString() || '0',
            has_bank_account: response.data.has_bank_account !== undefined ? response.data.has_bank_account.toString() : 'true'
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      const dataToSave = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        dependents: formData.dependents ? parseInt(formData.dependents, 10) : 0,
        has_bank_account: formData.has_bank_account === 'true'
      };
      
      await profileService.updateProfile(dataToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to save changes. Please verify server connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container profile-page">
        <div className="loading-card">
          <div className="spinner-large"></div>
          <p>Loading worker profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container profile-page">
      {/* Header — Tagline badge removed as requested */}
      <header className="page-header">
        <h1>
          <User size={36} className="glow-cyan" aria-hidden="true" />
          <span>{t('profile_title')}</span>
        </h1>
        <p>{t('profile_subtitle')}</p>
      </header>

      <main className="profile-main-card">
        {error && (
          <div className="profile-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="profile-top-banner">
          <div className="profile-avatar-pod">
            <User size={32} />
          </div>
          <div className="profile-banner-info">
            <h3>{formData.occupation || 'Unorganised Worker'}</h3>
            <span className="profile-badge">
              <Shield size={13} />
              <span>{t('profile_worker_tag')}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form-grid">
          {/* Preferred Language Setting */}
          <div className="field-group full-width-field" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label">
              <Globe size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {t('profile_lang_label')}
            </label>
            <p className="field-hint" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {t('profile_lang_hint')}
            </p>
            <div className="language-selector-pills" style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={`lang-select-pill ${language === 'te' ? 'active' : ''}`}
                onClick={() => setLanguage('te')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: language === 'te' ? '2px solid var(--accent-cyan, #06b6d4)' : '1px solid var(--border-color, #e2e8f0)',
                  backgroundColor: language === 'te' ? 'rgba(6, 182, 212, 0.12)' : 'var(--card-bg, #ffffff)',
                  color: language === 'te' ? 'var(--accent-cyan, #06b6d4)' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                తెలుగు (Telugu)
              </button>
              <button
                type="button"
                className={`lang-select-pill ${language === 'hi' ? 'active' : ''}`}
                onClick={() => setLanguage('hi')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: language === 'hi' ? '2px solid var(--accent-cyan, #06b6d4)' : '1px solid var(--border-color, #e2e8f0)',
                  backgroundColor: language === 'hi' ? 'rgba(6, 182, 212, 0.12)' : 'var(--card-bg, #ffffff)',
                  color: language === 'hi' ? 'var(--accent-cyan, #06b6d4)' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                हिन्दी (Hindi)
              </button>
              <button
                type="button"
                className={`lang-select-pill ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: language === 'en' ? '2px solid var(--accent-cyan, #06b6d4)' : '1px solid var(--border-color, #e2e8f0)',
                  backgroundColor: language === 'en' ? 'rgba(6, 182, 212, 0.12)' : 'var(--card-bg, #ffffff)',
                  color: language === 'en' ? 'var(--accent-cyan, #06b6d4)' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                English
              </button>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="profile-age" className="field-label">{t('profile_age_label')}</label>
            <input 
              id="profile-age"
              name="age"
              type="number" 
              inputMode="numeric"
              className="input-control" 
              placeholder="e.g. 35"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="profile-occupation" className="field-label">{t('profile_occupation_label')}</label>
            <input 
              id="profile-occupation"
              name="occupation"
              type="text" 
              className="input-control" 
              placeholder="e.g. Construction worker, Street vendor, Auto driver"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="profile-employment" className="field-label">{t('profile_employment_label')}</label>
            <select 
              id="profile-employment"
              name="employment_type"
              className="input-control"
              value={formData.employment_type}
              onChange={handleChange}
            >
              <option value="daily_wage">{t('emp_daily_wage')}</option>
              <option value="salaried">{t('emp_salaried')}</option>
              <option value="self_employed">{t('emp_self_employed')}</option>
              <option value="agricultural">{t('emp_agricultural')}</option>
              <option value="domestic">{t('emp_domestic')}</option>
              <option value="unemployed">{t('emp_unemployed')}</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="profile-income-band" className="field-label">{t('profile_income_label')}</label>
            <select 
              id="profile-income-band"
              name="income_band"
              className="input-control"
              value={formData.income_band}
              onChange={handleChange}
            >
              <option value="below_1L">{t('inc_below_1L')}</option>
              <option value="1L_to_2.5L">{t('inc_1L_25L')}</option>
              <option value="2.5L_to_5L">{t('inc_25L_5L')}</option>
              <option value="above_5L">{t('inc_above_5L')}</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="profile-dependents" className="field-label">{t('profile_dependents_label')}</label>
            <input 
              id="profile-dependents"
              name="dependents"
              type="number" 
              inputMode="numeric"
              className="input-control" 
              placeholder="e.g. 3"
              value={formData.dependents}
              onChange={handleChange}
              min="0"
              max="20"
            />
          </div>

          <div className="field-group">
            <label htmlFor="profile-bank" className="field-label">{t('profile_bank_label')}</label>
            <select 
              id="profile-bank"
              name="has_bank_account"
              className="input-control"
              value={formData.has_bank_account}
              onChange={handleChange}
            >
              <option value="true">{t('profile_bank_yes')}</option>
              <option value="false">{t('profile_bank_no')}</option>
            </select>
          </div>

          <div className="form-submit-full">
            <button 
              type="submit" 
              className={`btn-primary btn-save-profile ${saveSuccess ? 'success' : ''}`}
              disabled={saving}
            >
              {saveSuccess ? (
                <>
                  <Check size={20} />
                  <span>{t('profile_saved')}</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{saving ? t('profile_saving') : t('profile_save_btn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
