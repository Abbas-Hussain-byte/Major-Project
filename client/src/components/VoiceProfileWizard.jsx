import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Mic, Volume2, ArrowRight, ArrowLeft, Check, 
  Sparkles, ShieldCheck, User, AlertCircle, RefreshCw 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { profileService } from '../api/services';
import { speechProvider } from '../services/speech/browserSpeech';
import './VoiceProfileWizard.css';

export default function VoiceProfileWizard({ isOpen, onClose, onComplete }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    age: '32',
    occupation: 'Daily Wage Construction Worker',
    employment_type: 'daily_wage',
    income_band: 'below_1L',
    dependents: '3',
    has_bank_account: 'true'
  });

  // Load existing profile if available
  useEffect(() => {
    if (isOpen) {
      profileService.getProfile()
        .then(res => {
          if (res.data) {
            setProfileData({
              age: res.data.age ? res.data.age.toString() : '32',
              occupation: res.data.occupation || 'Daily Wage Construction Worker',
              employment_type: res.data.employment_type || 'daily_wage',
              income_band: res.data.income_band || 'below_1L',
              dependents: res.data.dependents ? res.data.dependents.toString() : '3',
              has_bank_account: res.data.has_bank_account !== undefined ? res.data.has_bank_account.toString() : 'true'
            });
          }
        })
        .catch(() => {});
      setCurrentStep(1);
    }
  }, [isOpen]);

  // Read question aloud
  const speakQuestion = async (text) => {
    if (isSpeakingQuestion) {
      speechProvider.stop();
      setIsSpeakingQuestion(false);
      return;
    }
    try {
      setIsSpeakingQuestion(true);
      await speechProvider.speak(text, language);
    } catch {
      // Ignored
    } finally {
      setIsSpeakingQuestion(false);
    }
  };

  // Web Speech recognition for answering by voice
  const startSpeechInput = (stepNum) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice recognition is not supported in this browser. Please type your answer.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      setIsListening(true);
      setError(null);

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.trim();
        setIsListening(false);
        parseVoiceAnswer(stepNum, spokenText);
      };

      recognition.onerror = (err) => {
        console.warn('Voice recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Helper to extract values from voice responses
  const parseVoiceAnswer = (stepNum, text) => {
    const lower = text.toLowerCase();
    if (stepNum === 1) {
      // Extract numbers for age
      const match = text.match(/\d+/);
      if (match) {
        setProfileData(prev => ({ ...prev, age: match[0] }));
      }
    } else if (stepNum === 2) {
      setProfileData(prev => ({ ...prev, occupation: text }));
    } else if (stepNum === 3) {
      if (lower.includes('1') || lower.includes('one') || lower.includes('below') || lower.includes('bpl') || lower.includes('లక్ష')) {
        setProfileData(prev => ({ ...prev, income_band: 'below_1L' }));
      } else if (lower.includes('2') || lower.includes('two')) {
        setProfileData(prev => ({ ...prev, income_band: '1L_to_2.5L' }));
      } else {
        setProfileData(prev => ({ ...prev, income_band: 'below_1L' }));
      }
    } else if (stepNum === 4) {
      const match = text.match(/\d+/);
      if (match) {
        setProfileData(prev => ({ ...prev, dependents: match[0] }));
      }
    } else if (stepNum === 5) {
      if (lower.includes('yes') || lower.includes('ha') || lower.includes('avunu') || lower.includes('undhi') || lower.includes('hai') || lower.includes('అవును') || lower.includes('हाँ')) {
        setProfileData(prev => ({ ...prev, has_bank_account: 'true' }));
      } else if (lower.includes('no') || lower.includes('nahi') || lower.includes('ledu') || lower.includes('లేదు') || lower.includes('नहीं')) {
        setProfileData(prev => ({ ...prev, has_bank_account: 'false' }));
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinalSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const dataToSave = {
        age: parseInt(profileData.age, 10) || 32,
        occupation: profileData.occupation || 'Daily Wage Worker',
        employment_type: profileData.employment_type || 'daily_wage',
        income_band: profileData.income_band || 'below_1L',
        dependents: parseInt(profileData.dependents, 10) || 0,
        has_bank_account: profileData.has_bank_account === 'true'
      };

      await profileService.updateProfile(dataToSave);
      localStorage.setItem('benefitlens_onboarded', 'true');
      
      // Dispatch profile update event so navbar account chip updates immediately
      window.dispatchEvent(new CustomEvent('benefitlens_profile_updated', { detail: dataToSave }));

      if (onComplete) onComplete(dataToSave);
      onClose();
      navigate('/eligibility');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Could not save profile to database. Please retry.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="wizard-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('wizard_title')}>
      <div className="wizard-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="wizard-header">
          <div className="wizard-title-group">
            <div className="wizard-badge-pod">
              <User size={18} />
            </div>
            <div>
              <h2 className="wizard-title">{t('wizard_title')}</h2>
              <span className="wizard-step-indicator">
                {t('wizard_step')} {currentStep} {t('wizard_of')} 5
              </span>
            </div>
          </div>

          <button type="button" className="btn-close-wizard" onClick={onClose} aria-label={t('wizard_close')}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="wizard-progress-track">
          <div 
            className="wizard-progress-fill" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>

        {/* Question Body */}
        <div className="wizard-body">
          {error && (
            <div className="wizard-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Question 1: Age */}
          {currentStep === 1 && (
            <div className="step-content fade-in">
              <div className="question-header">
                <h3>{t('wizard_q1')}</h3>
                <button 
                  type="button" 
                  className={`btn-speak-q ${isSpeakingQuestion ? 'active' : ''}`}
                  onClick={() => speakQuestion(t('wizard_q1'))}
                  title={t('wizard_tap_to_read')}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="question-subtext">{t('wizard_q1_sub')}</p>

              <div className="input-arena">
                <input 
                  type="number"
                  inputMode="numeric"
                  className="wizard-large-input"
                  placeholder={t('wizard_q1_placeholder')}
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  min="18"
                  max="100"
                />

                <button 
                  type="button" 
                  className={`btn-voice-record ${isListening ? 'listening' : ''}`}
                  onClick={() => startSpeechInput(1)}
                  title={isListening ? t('wizard_listening') : t('wizard_mic_tap')}
                >
                  <Mic size={20} />
                  <span>{isListening ? t('wizard_listening') : t('wizard_mic_tap')}</span>
                </button>
              </div>

              {/* Quick Preset Chips */}
              <div className="preset-chips-row">
                {['25', '32', '45', '58'].map(age => (
                  <button 
                    key={age} 
                    type="button" 
                    className={`preset-chip ${profileData.age === age ? 'active' : ''}`}
                    onClick={() => setProfileData({ ...profileData, age })}
                  >
                    {age} {t('wizard_yrs')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Primary Occupation */}
          {currentStep === 2 && (
            <div className="step-content fade-in">
              <div className="question-header">
                <h3>{t('wizard_q2')}</h3>
                <button 
                  type="button" 
                  className={`btn-speak-q ${isSpeakingQuestion ? 'active' : ''}`}
                  onClick={() => speakQuestion(t('wizard_q2'))}
                  title={t('wizard_tap_to_read')}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="question-subtext">{t('wizard_q2_sub')}</p>

              <div className="input-arena">
                <input 
                  type="text"
                  className="wizard-large-input"
                  placeholder={t('wizard_q2_placeholder')}
                  value={profileData.occupation}
                  onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                />

                <button 
                  type="button" 
                  className={`btn-voice-record ${isListening ? 'listening' : ''}`}
                  onClick={() => startSpeechInput(2)}
                  title={isListening ? t('wizard_listening') : t('wizard_mic_tap')}
                >
                  <Mic size={20} />
                  <span>{isListening ? t('wizard_listening') : t('wizard_mic_tap')}</span>
                </button>
              </div>

              {/* Quick Occupation Presets */}
              <div className="preset-chips-row">
                {[
                  { key: 'wizard_occ_construction', def: 'Construction Worker' },
                  { key: 'wizard_occ_vendor', def: 'Street Vendor' },
                  { key: 'wizard_occ_driver', def: 'Auto Driver' },
                  { key: 'wizard_occ_farmer', def: 'Agricultural Laborer' },
                  { key: 'wizard_occ_domestic', def: 'Domestic Helper' }
                ].map(occItem => {
                  const label = t(occItem.key) || occItem.def;
                  return (
                    <button 
                      key={occItem.key} 
                      type="button" 
                      className={`preset-chip ${profileData.occupation === label ? 'active' : ''}`}
                      onClick={() => setProfileData({ ...profileData, occupation: label })}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 3: Income Band */}
          {currentStep === 3 && (
            <div className="step-content fade-in">
              <div className="question-header">
                <h3>{t('wizard_q3')}</h3>
                <button 
                  type="button" 
                  className={`btn-speak-q ${isSpeakingQuestion ? 'active' : ''}`}
                  onClick={() => speakQuestion(t('wizard_q3'))}
                  title={t('wizard_tap_to_read')}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="question-subtext">{t('wizard_q3_sub')}</p>

              <div className="options-vertical-grid">
                {[
                  { id: 'below_1L', label: t('inc_below_1L') },
                  { id: '1L_to_2.5L', label: t('inc_1L_25L') },
                  { id: '2.5L_to_5L', label: t('inc_25L_5L') },
                  { id: 'above_5L', label: t('inc_above_5L') }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    type="button"
                    className={`option-card-btn ${profileData.income_band === opt.id ? 'active' : ''}`}
                    onClick={() => setProfileData({ ...profileData, income_band: opt.id })}
                  >
                    <span className="radio-dot"></span>
                    <span className="option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 4: Dependents */}
          {currentStep === 4 && (
            <div className="step-content fade-in">
              <div className="question-header">
                <h3>{t('wizard_q4')}</h3>
                <button 
                  type="button" 
                  className={`btn-speak-q ${isSpeakingQuestion ? 'active' : ''}`}
                  onClick={() => speakQuestion(t('wizard_q4'))}
                  title={t('wizard_tap_to_read')}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="question-subtext">{t('wizard_q4_sub')}</p>

              <div className="input-arena">
                <input 
                  type="number"
                  inputMode="numeric"
                  className="wizard-large-input"
                  placeholder={t('wizard_q4_placeholder')}
                  value={profileData.dependents}
                  onChange={(e) => setProfileData({ ...profileData, dependents: e.target.value })}
                  min="0"
                  max="20"
                />

                <button 
                  type="button" 
                  className={`btn-voice-record ${isListening ? 'listening' : ''}`}
                  onClick={() => startSpeechInput(4)}
                  title={isListening ? t('wizard_listening') : t('wizard_mic_tap')}
                >
                  <Mic size={20} />
                  <span>{isListening ? t('wizard_listening') : t('wizard_mic_tap')}</span>
                </button>
              </div>

              <div className="preset-chips-row">
                {['0', '1', '2', '3', '4+'].map(dep => (
                  <button 
                    key={dep} 
                    type="button" 
                    className={`preset-chip ${profileData.dependents === dep.replace('+', '') ? 'active' : ''}`}
                    onClick={() => setProfileData({ ...profileData, dependents: dep.replace('+', '') })}
                  >
                    {dep} Dependents
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 5: Bank / Jan Dhan Account */}
          {currentStep === 5 && (
            <div className="step-content fade-in">
              <div className="question-header">
                <h3>{t('wizard_q5')}</h3>
                <button 
                  type="button" 
                  className={`btn-speak-q ${isSpeakingQuestion ? 'active' : ''}`}
                  onClick={() => speakQuestion(t('wizard_q5'))}
                  title={t('wizard_tap_to_read')}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="question-subtext">{t('wizard_q5_sub')}</p>

              <div className="options-vertical-grid">
                <button 
                  type="button"
                  className={`option-card-btn ${profileData.has_bank_account === 'true' ? 'active' : ''}`}
                  onClick={() => setProfileData({ ...profileData, has_bank_account: 'true' })}
                >
                  <span className="radio-dot"></span>
                  <span className="option-label">{t('profile_bank_yes')}</span>
                </button>

                <button 
                  type="button"
                  className={`option-card-btn ${profileData.has_bank_account === 'false' ? 'active' : ''}`}
                  onClick={() => setProfileData({ ...profileData, has_bank_account: 'false' })}
                >
                  <span className="radio-dot"></span>
                  <span className="option-label">{t('profile_bank_no')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="wizard-footer">
          {currentStep > 1 && (
            <button type="button" className="btn-wizard-back" onClick={handleBack}>
              <ArrowLeft size={16} />
              <span>{t('wizard_prev')}</span>
            </button>
          )}

          <button 
            type="button" 
            className="btn-primary btn-wizard-next" 
            onClick={handleNext}
            disabled={isSaving}
          >
            {isSaving ? (
              <span>{t('wizard_saving')}</span>
            ) : currentStep === 5 ? (
              <>
                <Check size={18} />
                <span>{t('wizard_finish')}</span>
              </>
            ) : (
              <>
                <span>{t('wizard_next')}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
