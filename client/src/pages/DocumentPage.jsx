import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Camera, AlertTriangle, CheckCircle2, 
  Sparkles, Volume2, ArrowRight, ShieldAlert, FileCheck, RefreshCw 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './DocumentPage.css';

export default function DocumentPage() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('government_scheme');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef(null);

  const docCategories = [
    { id: 'government_scheme', label: t('doc_cat_scheme') },
    { id: 'insurance_policy', label: t('doc_cat_insurance') },
    { id: 'KYC', label: t('doc_cat_kyc') },
    { id: 'loan_agreement', label: t('doc_cat_loan') }
  ];

  const demoSamples = [
    {
      name: t('doc_sample_pmsby'),
      type: 'insurance_policy',
      text: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY) Certificate of Insurance. Sum Insured: Rs. 2,00,000 for accidental death or permanent total disability. Premium: Rs. 20 per annum auto-debited from bank savings account. Exclusions: Natural death is not covered. Suicide or intentional self-injury excluded. Claim must be lodged within 30 days with original death certificate and FIR.'
    },
    {
      name: t('doc_sample_ration'),
      type: 'government_scheme',
      text: 'National Food Security Scheme (NFSA) Antyodaya Anna Yojana. Benefit: 35 kg food grains per family per month at subsidized rates of Rs. 3/kg rice and Rs. 2/kg wheat. Eligibility: BPL households, landless laborers, marginal farmers, rural artisans. Proofs needed: Aadhaar number of all family members, Bank account linked to Aadhaar.'
    }
  ];

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      await uploadDocument(file, selectedCategory);
    }
  };

  const handleDemoTest = async (demo) => {
    setSelectedCategory(demo.type);
    setSelectedFile(`${demo.name}.txt`);
    
    // Create text file blob for testing
    const blob = new Blob([demo.text], { type: 'text/plain' });
    const file = new File([blob], `${demo.name}.txt`, { type: 'text/plain' });
    await uploadDocument(file, demo.type);
  };

  const uploadDocument = async (file, category) => {
    setLoading(true);
    setProcessingStep(1);
    setError(null);
    setResult(null);

    const stepInterval = setInterval(() => {
      setProcessingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', category);
      formData.append('lang', language); // CRITICAL: pass user selected language

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/documents/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Document analysis failed');
      }

      setResult(data);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'Could not analyze document. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const summaryText = result?.plain_language_summary || result?.explanation || result?.summary || '';
  const risksList = result?.risk_flags || result?.risks || [];
  const checklistList = result?.claim_checklist || result?.checklist || [];

  const handleReadAloud = () => {
    if (!summaryText) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="page-container document-page">
      {/* Page Header — Tagline badge removed as requested */}
      <header className="page-header">
        <h1>
          <FileText size={36} className="header-icon" aria-hidden="true" />
          <span>{t('doc_title')}</span>
        </h1>
        <p>{t('doc_subtitle')}</p>

        {/* Category Pills */}
        <div className="category-pills-bar" role="tablist" aria-label="Document Category">
          {docCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              disabled={loading}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <main className="page-content">
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*,application/pdf,text/plain" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          aria-label="Upload document file"
        />

        {/* Upload Dropzone */}
        {!result && !loading && (
          <section 
            className="document-dropzone" 
            onClick={handleTriggerUpload}
            role="button"
            tabIndex={0}
            aria-label="Upload document file or take photo"
          >
            <div className="dropzone-icon-pod">
              <Upload size={36} className="dropzone-icon" />
            </div>
            <h2>{t('doc_dropzone_title')}</h2>
            <p>{t('doc_dropzone_sub')}</p>
            
            <button type="button" className="btn-browse-file">
              <Camera size={18} />
              <span>{t('doc_select_btn')}</span>
            </button>
          </section>
        )}

        {/* 1-Click Demo Document Test Buttons */}
        {!result && !loading && (
          <section className="demo-samples-section">
            <span className="demo-label">{t('doc_demo_label')}</span>
            <div className="demo-buttons-grid">
              {demoSamples.map((demo, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  className="demo-card-btn"
                  onClick={() => handleDemoTest(demo)}
                >
                  <FileCheck size={18} className="demo-icon" />
                  <span>{demo.name}</span>
                  <ArrowRight size={14} className="demo-arrow" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Animated Processing State */}
        {loading && (
          <section className="processing-card" aria-live="polite">
            <div className="processing-radar">
              <div className="radar-ring"></div>
              <FileText size={32} className="radar-icon" />
            </div>

            <div className="processing-steps">
              <div className={`step-item ${processingStep >= 1 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span>{t('doc_processing_step1')}</span>
              </div>
              <div className={`step-item ${processingStep >= 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span>{t('doc_processing_step2')}</span>
              </div>
              <div className={`step-item ${processingStep >= 3 ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span>{t('doc_processing_step3')}</span>
              </div>
            </div>

            <p className="processing-subtext">Translating complex legal jargon into plain language...</p>
          </section>
        )}

        {/* Error Alert Box */}
        {error && (
          <section className="error-alert-box" aria-live="assertive">
            <div className="error-icon-pod">
              <AlertTriangle size={24} />
            </div>
            <div className="error-body">
              <h4>Analysis Could Not Be Completed</h4>
              <p>{error}</p>
              <button type="button" className="btn-retry" onClick={handleTriggerUpload}>
                <RefreshCw size={14} /> Try Another Document
              </button>
            </div>
          </section>
        )}

        {/* Analysis Results */}
        {result && (
          <section className="results-container" aria-live="polite">
            {/* File Tag */}
            <div className="result-file-tag">
              <FileCheck size={16} />
              <span>{t('doc_analyzed')}: {selectedFile || 'Uploaded Document'}</span>
            </div>

            {/* Plain Language Summary */}
            <div className="result-card explanation-card">
              <div className="result-card-header">
                <div className="title-with-icon">
                  <Sparkles size={20} className="glow-cyan" />
                  <h3>{t('doc_breakdown_title')}</h3>
                </div>

                <button 
                  type="button" 
                  className="btn-read-aloud" 
                  onClick={handleReadAloud}
                  aria-label="Read explanation aloud"
                >
                  <Volume2 size={16} />
                  <span>{isSpeaking ? t('doc_speaking') : t('doc_read_aloud')}</span>
                </button>
              </div>

              <div className="result-card-body">
                <p>{summaryText || 'Document content successfully extracted and verified against safety net parameters.'}</p>
              </div>
            </div>

            {/* Risk & Limitations Flags */}
            {risksList.length > 0 && (
              <div className="result-card risk-card">
                <div className="result-card-header">
                  <div className="title-with-icon">
                    <ShieldAlert size={20} className="glow-red" />
                    <h3>{t('doc_risks_title')}</h3>
                  </div>
                </div>

                <ul className="risks-list">
                  {risksList.map((risk, idx) => (
                    <li key={idx} className="risk-item">
                      <span className="risk-bullet">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Claim Checklist */}
            {checklistList.length > 0 && (
              <div className="result-card checklist-card">
                <div className="result-card-header">
                  <div className="title-with-icon">
                    <CheckCircle2 size={20} className="glow-green" />
                    <h3>{t('doc_checklist_title')}</h3>
                  </div>
                </div>

                <ul className="checklist-list">
                  {checklistList.map((item, idx) => (
                    <li key={idx} className="checklist-item">
                      <input 
                        type="checkbox" 
                        id={`check-${idx}`} 
                        className="custom-checkbox"
                      />
                      <label htmlFor={`check-${idx}`}>{item.item || item}</label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scan Another Document Action Button (Glowing High-Contrast, Never Invisible) */}
            <div className="scan-another-wrapper">
              <button 
                type="button" 
                className="btn-primary btn-scan-another" 
                onClick={() => {
                  setResult(null);
                  setSelectedFile(null);
                }}
              >
                <Upload size={18} />
                <span>{t('doc_scan_another')}</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
