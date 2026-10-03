import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Send, Volume2, VolumeX, ShieldCheck, AlertCircle, 
  ExternalLink, Search, X, ChevronRight, CheckCircle2, 
  Sparkles, Filter, Info, ArrowUpRight, HelpCircle
} from 'lucide-react';
import MicButton from '../components/MicButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../services/speech/useVoice';
import { speechProvider } from '../services/speech/browserSpeech';
import { 
  FINANCIAL_LITERACY_CHUNKS, 
  LITERACY_CATEGORIES, 
  getLocalizedChunk 
} from '../data/financialLiteracyData';
import { literacyService } from '../api/services';
import './LiteracyPage.css';

export default function LiteracyPage() {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const activeLang = language || 'en';

  // Data state
  const [chunks, setChunks] = useState(FINANCIAL_LITERACY_CHUNKS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChunk, setSelectedChunk] = useState(null);

  // Audio speech synthesis state for Reader Modal & Card Quick Play
  const [playingChunkId, setPlayingChunkId] = useState(null);
  const [isModalSpeaking, setIsModalSpeaking] = useState(false);
  const speechRef = useRef(null);

  // Text & Voice RAG state
  const [question, setQuestion] = useState('');

  const {
    micState,
    errorMsg,
    lastQuery,
    lastAnswer,
    sources,
    responseStatus,
    isSpeaking,
    startListening,
    askText,
    replaySpeech,
    stop
  } = useVoice({ lang: activeLang, moduleName: 'literacy' });

  // Auto-listen if routed with ?autostart=1
  useEffect(() => {
    if (searchParams.get('autostart') === '1') {
      startListening();
    }
  }, [searchParams]);

  // Attempt to fetch fresh chunks from backend API, graceful fallback to static data
  useEffect(() => {
    let isMounted = true;
    literacyService.getChunks()
      .then(res => {
        const chunksArr = Array.isArray(res?.data) ? res.data : (res?.data?.chunks || []);
        if (isMounted && Array.isArray(chunksArr) && chunksArr.length > 0) {
          setChunks(chunksArr);
        }
      })
      .catch(err => {
        // Graceful fallback: local verified chunks are already loaded in state
        console.warn('[LiteracyPage] Backend chunks API offline, using local verified corpus:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  // Clean up any ongoing TTS audio on unmount or language change
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [activeLang]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedChunk) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChunk]);

  // TTS Speech Synthesis Engine via Sarvam AI & browser fallback
  const stopAudio = () => {
    speechProvider.stop();
    setPlayingChunkId(null);
    setIsModalSpeaking(false);
  };

  const playAudio = async (text, chunkId = null, isModal = false) => {
    if (!text) return;

    // If currently speaking this exact item, toggle off
    if (isModal && isModalSpeaking) {
      stopAudio();
      return;
    }
    if (!isModal && playingChunkId === chunkId) {
      stopAudio();
      return;
    }

    stopAudio();

    if (isModal) setIsModalSpeaking(true);
    if (chunkId) setPlayingChunkId(chunkId);

    try {
      await speechProvider.speak(text, activeLang);
    } catch (err) {
      console.warn('[Literacy TTS Error]:', err);
    } finally {
      if (isModal) setIsModalSpeaking(false);
      setPlayingChunkId(null);
    }
  };

  // Filter chunks by Category and Search query
  const filteredChunks = useMemo(() => {
    return chunks.filter(item => {
      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory && item.topic !== activeCategory) {
        return false;
      }

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const loc = item[activeLang] || item.en || {};
      const title = (loc.title || '').toLowerCase();
      const content = (loc.content_text || '').toLowerCase();
      const enTitle = (item.en?.title || '').toLowerCase();
      const enContent = (item.en?.content_text || '').toLowerCase();
      const org = (item.organization || '').toLowerCase();

      return title.includes(q) || content.includes(q) || enTitle.includes(q) || enContent.includes(q) || org.includes(q);
    });
  }, [chunks, activeCategory, searchQuery, activeLang]);

  // Card click handler
  const handleOpenChunk = (chunk) => {
    stopAudio();
    setSelectedChunk(chunk);
  };

  const handleCloseModal = () => {
    stopAudio();
    setSelectedChunk(null);
  };

  // Voice Mic click
  const handleMicClick = () => {
    if (micState === 'listening' || micState === 'processing') stop();
    else startListening();
  };

  // Text query submit
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || micState === 'processing') return;
    const q = question;
    setQuestion('');
    try {
      await askText(q);
    } catch {
      // Handled inside useVoice
    }
  };

  // Ask AI about this chunk from inside modal
  const handleAskAboutChunk = async (chunk) => {
    const loc = chunk[activeLang] || chunk.en || {};
    const qText = loc.title || chunk.en?.title;
    handleCloseModal();
    setQuestion(qText);
    try {
      await askText(qText);
    } catch {
      // Handled inside useVoice
    }
  };

  // Extract structured takeaways
  const extractTakeaways = (text) => {
    if (!text) return [];
    const parts = text
      .split(/(?<=[.।!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 6);
    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className="page-container literacy-page">
      {/* Header */}
      <header className="page-header literacy-main-header">
        <div className="literacy-title-pod">
          <div className="literacy-badge-icon">
            <BookOpen size={28} />
          </div>
          <div>
            <h1>{t('literacy_title')}</h1>
            <p className="literacy-header-sub">{t('literacy_subtitle')}</p>
          </div>
        </div>

        <div className="literacy-meta-bar">
          <div className="meta-pill verified-corpus">
            <ShieldCheck size={16} />
            <span>{t('literacy_grounded_corpus')}</span>
          </div>
          <div className="meta-pill count-badge">
            <Sparkles size={14} />
            <span>32 {t('literacy_chunks_count')}</span>
          </div>
        </div>
      </header>

      <main className="page-content">
        {/* Interactive Voice & Text Q&A Hero Card */}
        <section className="literacy-hero-card" aria-label="Voice financial literacy advisor">
          <div className="hero-card-left">
            <div className="mic-interactive-wrapper">
              <MicButton 
                size="hero" 
                state={micState} 
                onClick={handleMicClick} 
                label={`Tap to ask in ${activeLang === 'te' ? 'Telugu' : activeLang === 'hi' ? 'Hindi' : 'English'}`}
              />
            </div>
            <div className="status-banner" aria-live="polite">
              {micState === 'listening' && (
                <div className="status-pill listening">
                  <span className="live-dot"></span>
                  <span>{t('home_mic_listening')}</span>
                </div>
              )}
              {micState === 'processing' && (
                <div className="status-pill processing">
                  <span className="spinner-mini"></span>
                  <span>{t('home_mic_processing')}</span>
                </div>
              )}
              {micState === 'speaking' && (
                <div className="status-pill speaking">
                  <Volume2 size={16} />
                  <span>{t('home_mic_speaking')}</span>
                </div>
              )}
              {micState === 'idle' && (
                <p className="idle-instruction">
                  {t('home_mic_tap')} or search the verified guides below.
                </p>
              )}
              {micState === 'error' && (
                <div className="status-pill error">
                  <AlertCircle size={16} />
                  <span>{errorMsg || t('home_mic_error')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Search & Question Form */}
          <div className="hero-card-right">
            <form className="chat-input-form" onSubmit={handleTextSubmit}>
              <Search size={18} className="search-lead-icon" />
              <input 
                type="text" 
                className="chat-text-input"
                placeholder={micState === 'listening' ? t('home_mic_listening') : t('literacy_ask_placeholder')}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={micState === 'processing'}
                aria-label="Ask or search financial question"
              />
              <button 
                type="submit" 
                className="chat-send-btn"
                disabled={!question.trim() || micState === 'processing'}
                aria-label="Send question to AI advisor"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>

        {/* Answer Card when AI Responds */}
        {lastAnswer && (
          <section className="answer-card fade-in" aria-live="polite">
            {lastQuery && (
              <div className="query-quote">
                <strong>{t('home_you_asked')}:</strong> "{lastQuery}"
              </div>
            )}

            <div className="answer-text">
              <p>{lastAnswer}</p>
            </div>

            <div className="answer-meta">
              <div className="grounded-badge">
                <ShieldCheck size={16} />
                <span>{t('home_safety_net_source')}</span>
              </div>

              <button 
                type="button" 
                className="btn-replay" 
                onClick={replaySpeech}
                disabled={isSpeaking}
                aria-label="Replay spoken answer"
              >
                <Volume2 size={18} />
                <span>{isSpeaking ? t('home_speaking') : t('home_listen_again')}</span>
              </button>
            </div>

            {sources && sources.length > 0 && (
              <div className="sources-container">
                <span className="sources-title">{t('home_verified_sources')}</span>
                <div className="sources-grid">
                  {sources.map((src, i) => (
                    <div key={i} className="source-item">
                      <span className="source-bullet">✓</span>
                      <span className="source-name">{src.title}</span>
                      {src.topic && <span className="source-topic">({src.topic})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Category Filter Pills & Search Bar */}
        <section className="topics-browse-header" aria-label="Browse official financial topics">
          <div className="category-tabs-scroll">
            {LITERACY_CATEGORIES.map(cat => {
              const label = cat[activeLang] || cat.en;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="browse-filter-bar">
            <div className="browse-search-wrapper">
              <Search size={16} className="browse-search-icon" />
              <input 
                type="text"
                className="browse-search-input"
                placeholder={t('literacy_search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter guides"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="browse-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear filter search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="guides-count-chip">
              <span>{filteredChunks.length} {t('literacy_chunks_count')}</span>
            </div>
          </div>
        </section>

        {/* 32 Topic Cards Grid */}
        <section className="topics-cards-section" aria-label="Financial Literacy Topic Guides">
          {filteredChunks.length === 0 ? (
            <div className="no-topics-found">
              <Info size={32} />
              <p>{t('literacy_no_results')}</p>
              <button 
                type="button" 
                className="btn-reset-filters"
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              >
                {t('literacy_all_categories')}
              </button>
            </div>
          ) : (
            <div className="topics-grid">
              {filteredChunks.map((chunk) => {
                const loc = chunk[activeLang] || chunk.en || {};
                const title = loc.title || chunk.en?.title || 'Financial Guide';
                const body = loc.content_text || chunk.en?.content_text || '';
                const snippet = body.length > 140 ? body.substring(0, 140) + '...' : body;
                const isPlaying = playingChunkId === chunk.id;

                return (
                  <article 
                    key={chunk.id} 
                    className="topic-card"
                    onClick={() => handleOpenChunk(chunk)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleOpenChunk(chunk); }}
                    aria-label={`Open guide: ${title}`}
                  >
                    <div className="card-top-row">
                      <div className="badge-group">
                        <span className="org-badge">{chunk.organization || 'Official'}</span>
                        <span className="topic-badge">{chunk.topic || chunk.category}</span>
                      </div>
                      <span className="verified-status-tag" title="Verified regulatory circular">
                        <ShieldCheck size={13} />
                        <span>{chunk.verified_level === 'A' ? 'RBI Verified' : 'Gazette'}</span>
                      </span>
                    </div>

                    <h3 className="card-topic-title">{title}</h3>
                    <p className="card-topic-snippet">{snippet}</p>

                    <div className="card-bottom-actions">
                      <span className="card-read-cta">
                        <span>{t('literacy_read_guide')}</span>
                        <ChevronRight size={16} className="cta-arrow" />
                      </span>

                      {/* Quick Listen Button on Card */}
                      <button
                        type="button"
                        className={`card-audio-btn ${isPlaying ? 'playing' : ''}`}
                        title={isPlaying ? t('literacy_stop_reading') : t('literacy_listen_aloud')}
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(body, chunk.id, false);
                        }}
                        aria-label={`Listen to ${title}`}
                      >
                        {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Interactive Reader Modal */}
      {selectedChunk && (
        <div 
          className="modal-backdrop fade-in"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-modal-title"
        >
          <div 
            className="reader-modal-container slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="reader-modal-header">
              <div className="reader-badges">
                <span className="org-badge-large">{selectedChunk.organization || 'Official Regulatory Guidance'}</span>
                <span className="topic-badge-large">{selectedChunk.topic || selectedChunk.category}</span>
                {selectedChunk.section && (
                  <span className="section-badge">Ref: {selectedChunk.section}</span>
                )}
                <span className="verified-badge-large">
                  <ShieldCheck size={15} />
                  <span>{t('literacy_verified_tag')}</span>
                </span>
              </div>

              <button 
                type="button" 
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close guide modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="reader-modal-body">
              {(() => {
                const loc = selectedChunk[activeLang] || selectedChunk.en || {};
                const title = loc.title || selectedChunk.en?.title || 'Regulatory Guide';
                const body = loc.content_text || selectedChunk.en?.content_text || '';
                const takeaways = extractTakeaways(body);

                return (
                  <>
                    <h2 id="reader-modal-title" className="reader-title">{title}</h2>

                    {/* Primary Explanation */}
                    <div className="reader-content-box">
                      <p className="reader-paragraph">{body}</p>
                    </div>

                    {/* Structured Key Takeaways */}
                    <div className="takeaways-box">
                      <h4 className="takeaways-heading">
                        <CheckCircle2 size={18} className="takeaway-icon-head" />
                        <span>{t('literacy_takeaways_title')}</span>
                      </h4>
                      <ul className="takeaways-list">
                        {takeaways.map((item, idx) => (
                          <li key={idx} className="takeaway-item">
                            <span className="takeaway-bullet">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Source Verification Box */}
                    {selectedChunk.source_url && (
                      <div className="source-citation-card">
                        <div className="citation-text">
                          <span className="citation-label">{t('literacy_official_source')}</span>
                          <span className="citation-url">{selectedChunk.organization} Circular ({selectedChunk.section || 'Official Guidelines'})</span>
                        </div>
                        <a 
                          href={selectedChunk.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-open-source"
                          title="Verify source circular in new tab"
                        >
                          <span>{t('schemes_official_portal')}</span>
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Modal Bottom Actions */}
            <div className="reader-modal-footer">
              {(() => {
                const loc = selectedChunk[activeLang] || selectedChunk.en || {};
                const body = loc.content_text || selectedChunk.en?.content_text || '';

                return (
                  <>
                    <button
                      type="button"
                      className={`btn-reader-listen ${isModalSpeaking ? 'speaking' : ''}`}
                      onClick={() => playAudio(body, null, true)}
                    >
                      {isModalSpeaking ? (
                        <>
                          <VolumeX size={18} />
                          <span>{t('literacy_stop_reading')}</span>
                          <span className="speaking-wave"></span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={18} />
                          <span>{t('literacy_listen_aloud')}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-reader-ask-ai"
                      onClick={() => handleAskAboutChunk(selectedChunk)}
                    >
                      <Sparkles size={16} />
                      <span>{t('literacy_ask_ai')}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-reader-close"
                      onClick={handleCloseModal}
                    >
                      {t('literacy_modal_close')}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
