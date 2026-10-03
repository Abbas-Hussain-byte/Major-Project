import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import MicButton from '../components/MicButton';
import { useVoice } from '../services/speech/useVoice';
import { speechProvider } from '../services/speech/browserSpeech';
import { 
  User, Volume2, ArrowRight, CheckCircle2, 
  Send, HelpCircle, BookOpen, AlertCircle, ShieldCheck, ChevronRight,
  Sparkles, Mic
} from 'lucide-react';
import VoiceProfileWizard from '../components/VoiceProfileWizard';
import { profileService } from '../api/services';
import './Home.css';

export default function Home() {
  const [searchParams] = useSearchParams();
  const { language, setLanguage, t } = useLanguage();
  const moduleName = import.meta.env.VITE_VOICE_ECHO === 'true' ? 'echo' : 'literacy';
  const { 
    micState, 
    errorMsg, 
    lastQuery, 
    lastAnswer, 
    sources, 
    startListening, 
    askText, 
    replaySpeech, 
    stop, 
    isSpeaking 
  } = useVoice({ lang: language, moduleName });
  
  const [onboardingStep, setOnboardingStep] = useState(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) return parseInt(stepParam, 10);
    return localStorage.getItem('benefitlens_onboarded') === 'true' ? 4 : 4;
  });
  const [profileData, setProfileData] = useState({ age: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isGreetingSpeaking, setIsGreetingSpeaking] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    if (errorMsg) {
      setToast(errorMsg);
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleMicClick = () => {
    if (micState === 'listening' || micState === 'processing' || micState === 'speaking') {
      stop();
    } else {
      startListening();
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setOnboardingStep(2);
  };

  const handleSkipToDashboard = () => {
    localStorage.setItem('benefitlens_onboarded', 'true');
    setOnboardingStep(4);
  };

  const handleSaveProfile = async () => {
    if (!profileData.age) return;
    setIsSaving(true);
    try {
      await profileService.updateProfile({ age: parseInt(profileData.age, 10) });
      localStorage.setItem('benefitlens_onboarded', 'true');
      setOnboardingStep(4);
      setToast('Profile setup complete! Welcome to BenefitLens.');
      setTimeout(() => setToast(null), 3000);
    } catch {
      localStorage.setItem('benefitlens_onboarded', 'true');
      setOnboardingStep(4);
    }
    setIsSaving(false);
  };

  const handleTextSubmit = async (e) => {
    e?.preventDefault();
    if (!textInput.trim() || micState === 'processing') return;
    const q = textInput.trim();
    setTextInput('');
    try {
      await askText(q);
    } catch {
      setToast('Could not fetch answer. Please try again.');
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleChipClick = async (chipQuestion) => {
    if (micState === 'processing') return;
    setTextInput('');
    await askText(chipQuestion);
  };

  const speakGreeting = async () => {
    if (isGreetingSpeaking) {
      speechProvider.stop();
      setIsGreetingSpeaking(false);
      return;
    }
    const text = t('home_greeting');
    try {
      setIsGreetingSpeaking(true);
      await speechProvider.speak(text, language);
    } catch {
      // Ignored
    } finally {
      setIsGreetingSpeaking(false);
    }
  };

  const promptChips = [
    t('home_prompt_1'),
    t('home_prompt_2'),
    t('home_prompt_3'),
    t('home_prompt_4'),
    t('home_prompt_5'),
    t('home_prompt_6'),
  ];

  return (
    <main className="home-page-container page-transition" id="main-content">
      {/* Toast Alert */}
      {toast && (
        <div className="toast-message" role="alert" aria-live="assertive">
          <AlertCircle size={20} aria-hidden="true" />
          <span>{toast}</span>
        </div>
      )}

      {/* Onboarding Step 1: Language */}
      {onboardingStep === 1 && (
        <section className="onboarding-modal-card fade-in" aria-labelledby="step1-heading">
          <div className="onboarding-badge">Setup 1 of 3</div>
          <h2 id="step1-heading">Choose Your Language</h2>
          <p className="subtitle">భాషను ఎంచుకోండి / अपनी भाषा चुनें</p>
          <div className="language-grid" role="group" aria-label="Language selection options">
            <button 
              type="button" 
              className="onboarding-lang-btn" 
              onClick={() => handleLanguageSelect('te')}
            >
              <span className="native-script">తెలుగు</span>
              <span className="english-script">Telugu</span>
            </button>
            <button 
              type="button" 
              className="onboarding-lang-btn" 
              onClick={() => handleLanguageSelect('hi')}
            >
              <span className="native-script">हिन्दी</span>
              <span className="english-script">Hindi</span>
            </button>
            <button 
              type="button" 
              className="onboarding-lang-btn" 
              onClick={() => handleLanguageSelect('en')}
            >
              <span className="native-script">English</span>
              <span className="english-script">English</span>
            </button>
          </div>
          <button type="button" className="btn-skip-onboarding" onClick={handleSkipToDashboard}>
            Skip to Assistant &rarr;
          </button>
        </section>
      )}

      {/* Onboarding Step 2: Voice Tutorial */}
      {onboardingStep === 2 && (
        <section className="onboarding-modal-card fade-in" aria-labelledby="step2-heading">
          <div className="onboarding-badge">Setup 2 of 3</div>
          <div className="onboarding-icon" aria-hidden="true">
            <Volume2 size={40} />
          </div>
          <h2 id="step2-heading">How Voice Interaction Works</h2>
          <p className="instruction-text">
            Tap the glowing microphone in the center and speak in Telugu, Hindi, or English. 
            BenefitLens checks government safety nets and explains your entitlements simply.
          </p>
          <button 
            type="button" 
            className="primary-action-btn" 
            onClick={() => setOnboardingStep(3)}
          >
            <span>Continue</span>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
          <button type="button" className="btn-skip-onboarding" onClick={handleSkipToDashboard}>
            Skip to Assistant &rarr;
          </button>
        </section>
      )}

      {/* Onboarding Step 3: Quick Age Question */}
      {onboardingStep === 3 && (
        <section className="onboarding-modal-card fade-in" aria-labelledby="step3-heading">
          <div className="onboarding-badge">Setup 3 of 3</div>
          <div className="onboarding-icon" aria-hidden="true">
            <User size={40} />
          </div>
          <h2 id="step3-heading">Profile Eligibility Check</h2>
          <p className="instruction-text">What is your age?</p>
          <input 
            id="user-age-input"
            type="number" 
            className="large-age-input" 
            placeholder="e.g. 35"
            value={profileData.age}
            onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
            inputMode="numeric"
            min="18"
            max="100"
          />
          <button 
            type="button" 
            className="primary-action-btn" 
            onClick={handleSaveProfile}
            disabled={!profileData.age || isSaving}
          >
            <span>{isSaving ? 'Saving...' : 'Finish Setup'}</span>
            <CheckCircle2 size={20} aria-hidden="true" />
          </button>
          <button type="button" className="btn-skip-onboarding" onClick={handleSkipToDashboard}>
            Skip to Assistant &rarr;
          </button>
        </section>
      )}

      {/* Main Home Dashboard: Step 4 */}
      {onboardingStep === 4 && (
        <div className="home-dashboard fade-in">
          {/* Hero Welcome Banner (Badge Removed as requested) */}
          <div className="home-hero-banner">
            <h1 className="hero-title">
              {t('home_title')} <span className="gradient-highlight">BenefitLens</span>
            </h1>
            <p className="hero-subtitle">
              {t('home_subtitle')}
            </p>

            {/* Audio Greeting Card */}
            <div className="greeting-card">
              <p className="visual-greeting">{t('home_greeting')}</p>
              <button 
                type="button" 
                className={`btn-spoken-greeting ${isGreetingSpeaking ? 'active' : ''}`}
                onClick={speakGreeting}
                aria-label="Listen to greeting"
                title="Read greeting aloud"
              >
                <Volume2 size={20} aria-hidden="true" />
                <span>{isGreetingSpeaking ? t('home_speaking') : t('home_read_aloud')}</span>
              </button>
            </div>

            {/* Conversational Voice & Text Profile Setup Action Banner */}
            <div className="home-profile-cta-banner">
              <div className="cta-banner-content">
                <div className="cta-badge">
                  <Sparkles size={14} />
                  <span>{t('account_citizen')}</span>
                </div>
                <h2 className="cta-title">{t('home_setup_cta_title')}</h2>
                <p className="cta-description">{t('home_setup_cta_desc')}</p>
              </div>
              <button 
                type="button" 
                className="btn-start-wizard-cta"
                onClick={() => setIsWizardOpen(true)}
              >
                <Mic size={18} />
                <span>{t('home_start_voice_setup')}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Central Hero Voice Mic Arena (The Centerpiece!) */}
          <section className="central-mic-arena" aria-label="Voice Interaction Center">
            <div className="mic-interactive-centerpiece">
              <MicButton 
                state={micState} 
                onClick={handleMicClick} 
                size="hero" 
                label="Voice Assistant Microphone. Tap to speak." 
              />
            </div>

            {/* Status Pill Badge */}
            <div className="mic-status-badge">
              <span className={`status-indicator-dot ${micState}`}></span>
              <span className="status-indicator-text">
                {micState === 'listening' ? t('home_mic_listening') :
                 micState === 'processing' ? t('home_mic_processing') :
                 micState === 'speaking' ? t('home_mic_speaking') :
                 micState === 'error' ? t('home_mic_error') :
                 t('home_mic_tap')}
              </span>
            </div>
          </section>

          {/* High-Contrast Search & Text Fallback Bar */}
          <section className="search-bar-arena" aria-label="Text Question Input">
            <form onSubmit={handleTextSubmit} className="search-bar-form">
              <input 
                id="home-search-input"
                type="text" 
                className="search-bar-input" 
                placeholder={t('home_search_placeholder')}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={micState === 'processing'}
              />
              <button 
                type="submit" 
                className="btn-search-submit"
                disabled={!textInput.trim() || micState === 'processing'}
                aria-label="Submit question"
              >
                <Send size={18} />
                <span>{t('home_ask_btn')}</span>
              </button>
            </form>
          </section>

          {/* Skeleton Loader during Processing */}
          {micState === 'processing' && (
            <div className="skeleton-loader-card" role="status" aria-live="polite">
              <div className="skeleton-header-shimmer">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-title-bar"></div>
              </div>
              <div className="skeleton-line line-1"></div>
              <div className="skeleton-line line-2"></div>
              <div className="skeleton-line line-3"></div>
              <p className="skeleton-caption">Cross-referencing query with active government schemes...</p>
            </div>
          )}

          {/* Live Response Answer Card */}
          {lastAnswer && micState !== 'processing' && (
            <section className="answer-response-card fade-in" aria-live="polite">
              {lastQuery && (
                <div className="user-query-pill">
                  <span className="query-tag">{t('home_you_asked')}</span>
                  <p className="query-content">"{lastQuery}"</p>
                </div>
              )}

              <div className="answer-body">
                <p className="answer-paragraph">{lastAnswer}</p>
              </div>

              {/* Verified Sources */}
              {sources && sources.length > 0 && (
                <div className="verified-sources-box">
                  <span className="sources-header">{t('home_verified_sources')}</span>
                  <div className="sources-pills">
                    {sources.map((src, i) => (
                      <span key={i} className="source-pill-item">
                        <BookOpen size={13} />
                        <span>{src.title || src.scheme_name || src.source_name || 'Govt Portal'}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="answer-footer-bar">
                <div className="grounding-safety-tag">
                  <ShieldCheck size={16} />
                  <span>{t('home_safety_net_source')}</span>
                </div>

                <button 
                  type="button" 
                  className={`btn-listen-again ${isSpeaking ? 'active' : ''}`}
                  onClick={replaySpeech}
                  aria-label="Listen to answer again"
                >
                  <Volume2 size={18} />
                  <span>{isSpeaking ? t('home_speaking') : t('home_listen_again')}</span>
                </button>
              </div>
            </section>
          )}

          {/* Quick Prompts Desktop Grid */}
          <section className="quick-prompts-arena" aria-label="Suggested questions">
            <div className="prompts-header">
              <span>{t('home_prompts_title')}</span>
            </div>

            <div className="prompts-grid-desktop">
              {promptChips.map((chip, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  className="desktop-prompt-card"
                  onClick={() => handleChipClick(chip)}
                  disabled={micState === 'processing'}
                >
                  <span className="prompt-text">{chip}</span>
                  <ChevronRight size={16} className="prompt-arrow" />
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Citizen Conversational Profile Setup Modal */}
      <VoiceProfileWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </main>
  );
}
