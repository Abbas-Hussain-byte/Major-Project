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
    // 1. Instant local hydration from cache
    try {
      const cached = localStorage.getItem('benefitlens_profile');
      if (cached) {
        const p = JSON.parse(cached);
        setFormData({
          age: p.age !== undefined && p.age !== null ? p.age.toString() : '',
          occupation: p.occupation || '',
          employment_type: p.employment_type || 'daily_wage',
          income_band: p.income_band === '1L_3L' ? '1L_to_2.5L' : p.income_band === '3L_5L' ? '2.5L_to_5L' : p.income_band || 'below_1L',
          dependents: p.dependents !== undefined && p.dependents !== null ? p.dependents.toString() : '0',
          has_bank_account: p.has_bank_account !== undefined ? p.has_bank_account.toString() : 'true'
        });
        setLoading(false);
      }
    } catch {}

    // 2. Fetch latest from server
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
        if (response.data) {
          const p = response.data;
          setFormData({
            age: p.age !== undefined && p.age !== null ? p.age.toString() : '',
            occupation: p.occupation || '',
            employment_type: p.employment_type || 'daily_wage',
            income_band: p.income_band === '1L_3L' ? '1L_to_2.5L' : p.income_band === '3L_5L' ? '2.5L_to_5L' : p.income_band || 'below_1L',
            dependents: p.dependents !== undefined && p.dependents !== null ? p.dependents.toString() : '0',
            has_bank_account: p.has_bank_account !== undefined ? p.has_bank_account.toString() : 'true'
          });
          try {
            localStorage.setItem('benefitlens_profile', JSON.stringify(p));
          } catch {}
        }
      } catch (err) {
        console.warn("Using offline / cached profile data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLanguageSelect = (newLang) => {
    setLanguage(newLang);
    try {
      const cached = localStorage.getItem('benefitlens_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.preferred_language = newLang;
        localStorage.setItem('benefitlens_profile', JSON.stringify(parsed));
        window.dispatchEvent(new CustomEvent('benefitlens_profile_updated', { detail: parsed }));
      }
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      const parsedAge = formData.age ? parseInt(formData.age, 10) : undefined;
      const parsedDep = formData.dependents !== '' ? parseInt(formData.dependents, 10) : 0;
      const isBank = formData.has_bank_account === 'true' || formData.has_bank_account === true;

      const dataToSave = {
        age: parsedAge,
        occupation: (formData.occupation || '').trim(),
        employment_type: formData.employment_type || 'daily_wage',
        income_band: formData.income_band || 'below_1L',
        dependents: isNaN(parsedDep) ? 0 : parsedDep,
        has_bank_account: isBank,
        preferred_language: language
      };

      // Server payload mapping for schema compliance
      const serverPayload = {
        ...dataToSave,
        income_band: dataToSave.income_band === '1L_to_2.5L' ? '1L_3L' : dataToSave.income_band === '2.5L_to_5L' ? '3L_5L' : dataToSave.income_band,
        employment_type: ['gig_worker', 'street_vendor', 'daily_wage', 'other_unorganised'].includes(dataToSave.employment_type) 
          ? dataToSave.employment_type 
          : 'other_unorganised'
      };
      
      let finalSaved = { ...dataToSave };

      try {
        const res = await profileService.updateProfile(serverPayload);
        if (res?.data) {
          finalSaved = { ...dataToSave, ...res.data };
        }
      } catch (apiErr) {
        console.warn("Server update warning, storing locally:", apiErr.message);
      }

      // Persist to localStorage so the account section updates immediately across reloads
      try {
        localStorage.setItem('benefitlens_profile', JSON.stringify(finalSaved));
        localStorage.setItem('benefitlens_onboarded', 'true');
      } catch {}

      // Dispatch dynamic profile update event to Navigation and other components
      window.dispatchEvent(new CustomEvent('benefitlens_profile_updated', { detail: finalSaved }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to save changes. Please try again.");
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
            <h3>{formData.occupation || t('account_citizen')}</h3>
            <span className="profile-badge">
              <Shield size={13} />
              <span>{t('profile_worker_tag')}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form-grid">
          {/* Preferred Language Setting */}
          <div className="field-group full-width-field">
            <label className="field-label" htmlFor="profile-lang-selector">
              <Globe size={16} className="field-label-icon" aria-hidden="true" />
              <span>{t('profile_lang_label')}</span>
            </label>
            <p className="field-hint">
              {t('profile_lang_hint')}
            </p>
            <div className="language-selector-pills" id="profile-lang-selector" role="group" aria-label={t('profile_lang_label')}>
              <button
                type="button"
                className={`lang-select-pill ${language === 'te' ? 'active' : ''}`}
                onClick={() => handleLanguageSelect('te')}
                aria-pressed={language === 'te'}
              >
                తెలుగు (Telugu)
              </button>
              <button
                type="button"
                className={`lang-select-pill ${language === 'hi' ? 'active' : ''}`}
                onClick={() => handleLanguageSelect('hi')}
                aria-pressed={language === 'hi'}
              >
                हिन्दी (Hindi)
              </button>
              <button
                type="button"
                className={`lang-select-pill ${language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageSelect('en')}
                aria-pressed={language === 'en'}
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
