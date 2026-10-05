import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, Sparkles, FileText, Coins, User, MessageSquare, 
  Globe, Sun, Moon, ChevronDown, ShieldCheck, Mic, BookOpen 
} from 'lucide-react';
import MicButton from './MicButton';
import VoiceProfileWizard from './VoiceProfileWizard';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { profileService } from '../api/services';
import './Navigation.css';

export default function Navigation({ onMicClick, isMicListening = false }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [citizenProfile, setCitizenProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('benefitlens_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const accountRef = useRef(null);

  // Fetch initial profile & listen for dynamic updates across components
  useEffect(() => {
    profileService.getProfile()
      .then(res => {
        if (res.data) {
          setCitizenProfile(res.data);
          try {
            localStorage.setItem('benefitlens_profile', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(() => {});

    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setCitizenProfile(prev => {
          const merged = { ...(prev || {}), ...e.detail };
          try {
            localStorage.setItem('benefitlens_profile', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    };

    window.addEventListener('benefitlens_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('benefitlens_profile_updated', handleProfileUpdate);
  }, []);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getIncomeTierLabel = (band) => {
    if (band === 'below_1L') return t('account_tier_bpl');
    if (band === '1L_3L' || band === '1L_to_2.5L') return t('account_tier_mid');
    if (band === '3L_5L' || band === '2.5L_to_5L' || band === 'above_5L') return t('account_tier_high');
    return t('account_tier_bpl');
  };

  const handleCenterMicClick = () => {
    if (onMicClick) {
      onMicClick();
    } else {
      navigate('/literacy?autostart=1');
    }
  };

  return (
    <>
      {/* Desktop Top Header Bar */}
      <header className="desktop-top-header">
        <div className="header-inner">
          <div className="brand-group" onClick={() => navigate('/')} role="button" tabIndex={0}>
            <div className="brand-logo-pod">
              <Shield size={22} className="brand-icon" />
              <Sparkles size={12} className="brand-sparkle" />
            </div>
            <div className="brand-text">
              <span className="brand-title">BenefitLens</span>
              <span className="brand-badge">Safety Net AI</span>
            </div>
          </div>

          <nav className="header-nav-links" aria-label="Desktop Primary Navigation">
            <NavLink 
              to="/" 
              className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
            >
              <MessageSquare size={16} />
              <span>{t('nav_assistant')}</span>
            </NavLink>

            <NavLink 
              to="/eligibility" 
              className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
            >
              <Shield size={16} />
              <span>{t('nav_schemes')}</span>
            </NavLink>

            <NavLink 
              to="/literacy" 
              className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>{t('nav_literacy')}</span>
            </NavLink>

            <NavLink 
              to="/documents" 
              className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
            >
              <FileText size={16} />
              <span>{t('nav_documents')}</span>
            </NavLink>

            <NavLink 
              to="/income" 
              className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
            >
              <Coins size={16} />
              <span>{t('nav_cashflow')}</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
            >
              <User size={16} />
              <span>{t('nav_profile')}</span>
            </NavLink>
          </nav>

          <div className="header-actions">
            {/* Theme Toggle Button (Dark / ClaimBrain Light) */}
            <button 
              type="button" 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Contrast Light Mode' : 'Switch to Midnight Dark Mode'}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? (
                <Sun size={17} className="theme-icon sun-icon" />
              ) : (
                <Moon size={17} className="theme-icon moon-icon" />
              )}
              <span className="theme-toggle-text">
                {theme === 'dark' ? t('theme_light') : t('theme_dark')}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="header-lang-switcher" role="group" aria-label="Language selection">
              <Globe size={14} className="globe-icon" />
              <button 
                type="button" 
                className={`lang-btn-pill ${language === 'te' ? 'active' : ''}`}
                onClick={() => setLanguage('te')}
              >
                తెలుగు
              </button>
              <button 
                type="button" 
                className={`lang-btn-pill ${language === 'hi' ? 'active' : ''}`}
                onClick={() => setLanguage('hi')}
              >
                हिन्दी
              </button>
              <button 
                type="button" 
                className={`lang-btn-pill ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>

            {/* AI Status */}
            <div className="ai-status-indicator" title="Gemini 2.5 Multi-Lingual AI Online">
              <span className="status-ping"></span>
              <span className="status-label">{t('nav_ai_online')}</span>
            </div>

            {/* Citizen Account Chip & Dropdown Drawer (Top Right Navbar) */}
            <div className="account-dropdown-wrapper" ref={accountRef}>
              <button 
                type="button" 
                className={`citizen-account-btn ${isAccountOpen ? 'open' : ''}`}
                onClick={() => setIsAccountOpen(prev => !prev)}
                aria-label="Citizen Safety Net Account"
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
              >
                <div className="account-avatar-mini">
                  <User size={14} />
                  <span className="account-status-dot"></span>
                </div>
                <div className="account-text-mini">
                  <span className="account-name-mini">
                    {citizenProfile?.occupation ? citizenProfile.occupation.split(' ')[0] : t('account_citizen')}
                  </span>
                  <span className="account-sub-mini">
                    {citizenProfile?.age ? `${citizenProfile.age} ${t('wizard_yrs')} • ${t('account_active_status')}` : t('dock_profile')}
                  </span>
                </div>
                <ChevronDown size={14} className={`dropdown-caret ${isAccountOpen ? 'rotate' : ''}`} />
              </button>

              {/* Dropdown Card */}
              {isAccountOpen && (
                <div className="citizen-account-dropdown fade-in" role="menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar-large">
                      <User size={24} />
                    </div>
                    <div className="dropdown-title-info">
                      <h4>{citizenProfile?.occupation || t('account_citizen')}</h4>
                      <span className="dropdown-status-pill">
                        <ShieldCheck size={12} />
                        <span>{t('account_verified')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-stats-grid">
                    <div className="dropdown-stat">
                      <span className="label">{t('account_stat_age')}</span>
                      <span className="val">{citizenProfile?.age ?? 32} {t('wizard_yrs')}</span>
                    </div>
                    <div className="dropdown-stat">
                      <span className="label">{t('account_stat_income')}</span>
                      <span className="val">{getIncomeTierLabel(citizenProfile?.income_band)}</span>
                    </div>
                    <div className="dropdown-stat">
                      <span className="label">{t('account_stat_bank')}</span>
                      <span className={`val ${citizenProfile?.has_bank_account !== false ? 'positive' : ''}`}>
                        {citizenProfile?.has_bank_account !== false ? t('account_active_bank') : t('account_no_bank')}
                      </span>
                    </div>
                    <div className="dropdown-stat">
                      <span className="label">{t('account_stat_dependents')}</span>
                      <span className="val">{citizenProfile?.dependents ?? 0} {t('account_members')}</span>
                    </div>
                  </div>

                  <div className="dropdown-actions">
                    <button 
                      type="button" 
                      className="btn-dropdown-action voice-setup"
                      onClick={() => {
                        setIsAccountOpen(false);
                        setIsWizardOpen(true);
                      }}
                    >
                      <Mic size={15} />
                      <span>{t('account_relaunch_wizard')}</span>
                    </button>

                    <button 
                      type="button" 
                      className="btn-dropdown-action view-profile"
                      onClick={() => {
                        setIsAccountOpen(false);
                        navigate('/profile');
                      }}
                    >
                      <User size={15} />
                      <span>{t('account_edit_profile')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Center Dock with Elevated Mic Button */}
      <nav className="floating-bottom-dock" aria-label="Action Dock with Voice Assistant">
        <div className="dock-group dock-left">
          <NavLink 
            to="/eligibility" 
            className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
            aria-label="Schemes & Benefits"
          >
            <Shield size={20} className="dock-icon" />
            <span className="dock-label">{t('dock_schemes')}</span>
          </NavLink>

          <NavLink 
            to="/documents" 
            className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
            aria-label="Document Explainer"
          >
            <FileText size={20} className="dock-icon" />
            <span className="dock-label">{t('dock_documents')}</span>
          </NavLink>
        </div>

        {/* Center Mic Button */}
        <div className="dock-center-mic">
          <div className="dock-mic-wrapper">
            <MicButton 
              size="nav" 
              state={isMicListening ? 'listening' : 'idle'} 
              onClick={handleCenterMicClick}
              label="Open Voice Assistant. Tap to speak."
            />
          </div>
        </div>

        <div className="dock-group dock-right">
          <NavLink 
            to="/income" 
            className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
            aria-label="Income & Expenses"
          >
            <Coins size={20} className="dock-icon" />
            <span className="dock-label">{t('dock_cashflow')}</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
            aria-label="User Profile"
          >
            <User size={20} className="dock-icon" />
            <span className="dock-label">{t('dock_profile')}</span>
          </NavLink>
        </div>
      </nav>

      {/* Conversational Voice & Text Profile Wizard Modal */}
      <VoiceProfileWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={(newProfile) => setCitizenProfile(newProfile)}
      />
    </>
  );
}
