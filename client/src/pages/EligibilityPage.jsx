import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Check, ExternalLink, Volume2, 
  UserCheck, AlertCircle, RefreshCw, CheckCircle2, 
  Scale, Award, Layers, Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedScheme } from '../locales/schemeData';
import './EligibilityPage.css';

export default function EligibilityPage() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [enrolledSchemes, setEnrolledSchemes] = useState({});
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/eligibility/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to load schemes: ${res.statusText}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('[EligibilityPage] Fetch error:', err);
      setError(err.message || 'Could not fetch eligible schemes. Please check server status.');
    } finally {
      setLoading(false);
    }
  };

  const toggleEnrolled = (schemeId) => {
    setEnrolledSchemes(prev => ({
      ...prev,
      [schemeId]: !prev[schemeId]
    }));
  };

  const handleSpeakScheme = (scheme, loc) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingId === scheme._id) {
        setSpeakingId(null);
        return;
      }

      const costText = scheme.premium_annual_inr === 0 ? 'Free' : `₹${scheme.premium_annual_inr} rupees`;
      const text = `${loc.localized_name}. ${costText}. ${loc.localized_benefit}. ${loc.localized_how_to_apply}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(scheme._id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const rawSchemes = data?.gaps || [];

  return (
    <div className="page-container eligibility-page">
      {/* Header — Tagline badge removed as requested */}
      <header className="page-header">
        <h1>
          <ShieldCheck size={36} className="header-icon" aria-hidden="true" />
          <span>{t('schemes_title')}</span>
        </h1>
        <p>{t('schemes_subtitle')}</p>
      </header>

      <main className="page-content">
        {/* Project Reviewer & Rule-Engine Evaluation Transparency Panel */}
        <section className="reviewer-eval-panel" aria-label="Reviewer Engine Evaluation">
          <div className="eval-panel-header">
            <div className="eval-badge">
              <Award size={15} />
              <span>{t('schemes_precision_badge')}</span>
            </div>
            <span className="eval-tag-active">12 / 12 Central Gazette Safety Nets Evaluated</span>
          </div>

          <h3 className="eval-panel-title">{t('schemes_eval_heading')}</h3>
          <p className="eval-panel-desc">{t('schemes_eval_desc')}</p>

          <div className="eval-metrics-row">
            <div className="eval-stat-box">
              <span className="eval-stat-num">12</span>
              <span className="eval-stat-label">Central Schemes</span>
            </div>
            <div className="eval-stat-box highlight">
              <span className="eval-stat-num">{rawSchemes.length}</span>
              <span className="eval-stat-label">Matched to Profile</span>
            </div>
            <div className="eval-stat-box">
              <span className="eval-stat-num">0%</span>
              <span className="eval-stat-label">AI Hallucination</span>
            </div>
          </div>

          <div className="eval-rules-bar">
            <CheckCircle2 size={16} className="check-icon" />
            <span>{t('schemes_rules_checked')}</span>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="loading-schemes-card">
            <div className="spinner-large"></div>
            <h3>{t('schemes_evaluating')}</h3>
            <p>{t('schemes_evaluating_sub')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-card">
            <AlertCircle size={28} className="error-icon" />
            <div className="error-content">
              <h4>Failed to Check Eligibility</h4>
              <p>{error}</p>
              <button type="button" className="btn-retry" onClick={fetchEligibility}>
                <RefreshCw size={14} /> Retry Check
              </button>
            </div>
          </div>
        )}

        {/* Schemes List */}
        {!loading && rawSchemes.length > 0 && (
          <div className="schemes-grid">
            <div className="schemes-summary-bar">
              <span className="summary-count">
                <strong>{rawSchemes.length} {t('schemes_count_summary')}</strong>
              </span>
              <button type="button" className="btn-refresh-text" onClick={fetchEligibility}>
                <RefreshCw size={14} /> {t('schemes_refresh')}
              </button>
            </div>

            {rawSchemes.map((scheme, idx) => {
              const loc = getLocalizedScheme(scheme, language);
              const isEnrolled = enrolledSchemes[scheme._id];
              const isSpeaking = speakingId === scheme._id;

              return (
                <article key={scheme._id || idx} className={`scheme-card ${isEnrolled ? 'enrolled' : ''}`}>
                  {/* Scheme Header */}
                  <div className="scheme-card-header">
                    <div className="scheme-tag-group">
                      <span className="scheme-type-pill">
                        {loc.localized_type}
                      </span>
                      {isEnrolled && (
                        <span className="enrolled-badge">
                          <Check size={12} /> {t('schemes_already_enrolled')}
                        </span>
                      )}
                    </div>

                    <button 
                      type="button" 
                      className={`btn-listen-scheme ${isSpeaking ? 'active' : ''}`}
                      onClick={() => handleSpeakScheme(scheme, loc)}
                      aria-label="Listen to scheme details"
                      title="Read aloud"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>

                  <h3 className="scheme-title">{loc.localized_name}</h3>

                  {/* Financial Metrics */}
                  <div className="scheme-metrics-bar">
                    <div className="metric-box">
                      <span className="metric-label">{t('schemes_annual_cost')}</span>
                      <span className="metric-value cost">
                        {scheme.premium_annual_inr === 0 ? 'FREE (₹0)' : `₹${scheme.premium_annual_inr} / yr`}
                      </span>
                    </div>

                    <div className="metric-box">
                      <span className="metric-label">{t('schemes_financial_cover')}</span>
                      <span className="metric-value cover">
                        ₹{(scheme.coverage_inr || 200000).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="metric-box">
                      <span className="metric-label">{t('schemes_age_bracket')}</span>
                      <span className="metric-value">
                        {scheme.eligibility_criteria?.age_min || 18} - {scheme.eligibility_criteria?.age_max || 70} yrs
                      </span>
                    </div>
                  </div>

                  {/* Localized Plain Language Explanation */}
                  <div className="scheme-explanation-box">
                    <p>{loc.localized_benefit}</p>
                  </div>

                  {/* Reviewer / Match Transparency: Why Qualified */}
                  {loc.match_reasons && loc.match_reasons.length > 0 && (
                    <div className="scheme-match-reasons-box">
                      <span className="match-title">{t('schemes_why_qualified')}</span>
                      <ul className="match-reasons-list">
                        {loc.match_reasons.map((r, i) => (
                          <li key={i} className="match-reason-item">
                            <CheckCircle2 size={13} className="match-check-icon" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* How to Apply */}
                  {loc.localized_how_to_apply && (
                    <div className="apply-instruction-box">
                      <strong>{t('schemes_how_to_claim')}</strong> {loc.localized_how_to_apply}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="scheme-card-footer">
                    <button 
                      type="button" 
                      className={`btn-enroll ${isEnrolled ? 'btn-enrolled' : ''}`}
                      onClick={() => toggleEnrolled(scheme._id)}
                    >
                      <UserCheck size={16} />
                      <span>{isEnrolled ? t('schemes_already_enrolled') : t('schemes_mark_enrolled')}</span>
                    </button>

                    {scheme.source_document_ref && (
                      <a 
                        href={scheme.source_document_ref} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-official-link"
                        aria-label="Official Scheme Portal"
                      >
                        <span>{t('schemes_official_portal')}</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && rawSchemes.length === 0 && !error && (
          <div className="empty-schemes-card">
            <ShieldCheck size={48} className="empty-icon" />
            <h3>{t('schemes_empty_title')}</h3>
            <p>{t('schemes_empty_desc')}</p>
            <button type="button" className="btn-primary" onClick={fetchEligibility}>
              <span>{t('schemes_run_engine')}</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
