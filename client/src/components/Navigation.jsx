import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, FileText, Coins, User, MessageSquare, Globe, Sun, Moon } from 'lucide-react';
import MicButton from './MicButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import './Navigation.css';

export default function Navigation({ onMicClick, isMicListening = false }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

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
            <div className="ai-status-indicator" title="Sarvam & Gemini AI Engines Online">
              <span className="status-ping"></span>
              <span className="status-label">{t('nav_ai_online')}</span>
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
    </>
  );
}
