# BenefitLens — Technical Specification for Scaffolding

## 1. Project Summary

**Name**: BenefitLens
**One-liner**: A voice-first financial protection and literacy platform that helps
underserved workers in India discover government schemes and insurance benefits
they already qualify for, understand financial documents in plain language, and
build basic financial literacy — all through spoken interaction in their own
language, not text.

**Problem being solved**: Gig workers, street vendors, and daily-wage earners in
India are entitled to government insurance schemes (PMJJBY, PMSBY, PM-JAY) and
welfare benefits, but remain unenrolled because information is scattered,
English-only, and poorly explained. Separately, people who do buy private
insurance or take loans are frequently mis-sold products they cannot fully
evaluate, often in documents they cannot read even in their own language.
Existing tools (scheme chatbots, insurance summarizers) each solve one slice of
this in isolation, remain text-based, and are reactive (user must know to ask).

**Target users**: Low-income unorganised-sector workers in India — the standard
government/economic classification covering gig workers, street vendors, and
daily-wage earners. Initial prototype focuses specifically on daily-wage and
informal workers. Design must not assume the user can read — audio is the
primary interaction mode, not a fallback.

---

## 2. Non-Negotiable Design Principles

These constraints should shape every implementation decision — treat violations
of these as bugs, not style choices:

1. **Audio-first, not text-first-with-a-language-toggle.** Every core action must
   be reachable and completable by voice alone. Text is a supported fallback,
   never the only path, and never the assumed default.
2. **Grounded generation only — no hallucinated financial claims.** Any answer
   involving eligibility criteria, benefit amounts, or financial advice must come
   from retrieved source documents (scheme text, RBI/NCFE material). If nothing
   relevant is retrieved, the system must say so explicitly rather than guessing.
   This is the single most important behavioral rule in the whole system.
3. **Translation-sandwich architecture for voice.** English is used as the
   internal pivot language where required by the selected model/API — don't
   hard-code the assumption that the LLM is incapable of Telugu/Hindi; treat
   this as the current implementation strategy, not an absolute constraint.
   Flow: speech → ASR (native language) → MT (translate to English) → LLM
   reasoning → MT (translate back) → TTS (native language).
4. **Stay in the MERN stack; avoid introducing Python.** All application logic
   (including the eligibility rule engine and RAG orchestration) should be
   implemented in Node.js/Express. External AI capabilities (LLM, embeddings,
   ASR/MT/TTS) are consumed via REST API calls to third-party services, not
   self-hosted Python models.
5. **Zero-cost infrastructure for this phase.** Every service in the stack must
   have a usable free tier. Do not introduce paid infrastructure dependencies.
6. **Corpus data is data, not code.** Scheme details, insurance product info, and
   literacy content must live in the database and be updatable without a
   redeploy — never hardcoded into application logic.
7. **Guide, never automate submission.** The system may generate a checklist of
   documents needed to file a claim or apply for a scheme, but must never
   attempt to submit anything to an insurer or government system on the user's
   behalf (no public write-APIs exist for this, and it carries real liability
   risk for an already-vulnerable user).

---

## 3. Core Modules (functional scope)

### 3.1 Voice & Language Gateway
- Accepts voice input in Telugu or Hindi; also accepts plain text input.
- Uses an ordered fallback chain for ASR/MT/TTS (e.g. Bhashini, then browser/Gemini fallback).
- ASR (speech-to-text) and TTS (text-to-speech) are handled by active providers (e.g., client-side browser speech or server-side APIs).
- MT (translation) uses the server's fallback chain, skipping translation entirely if the language is 'en'.
- On failure of one provider, it gracefully falls through to the next.
- On translation-in failure, prompts the user to repeat or switch to text. On translation-out failure, provides the English answer with a failure flag rather than dead-ending.
- Acts as the single entry/exit point between the outside world (voice/text) and
  the four processing modules below, which only ever operate in English.

### 3.2 Eligibility & Gap Detection Engine
- Maintains a corpus of government schemes and government/private insurance
  products (start with PMJJBY, PMSBY, PM-JAY plus a small curated set). Both
  government schemes and insurance products are core to this corpus — this is
  the project's central differentiator from schemes-only or insurance-only
  competitors, and must not be narrowed to schemes-only.
- **The eligibility decision itself must never depend on the LLM.** It is made
  by two deterministic components only:
  - **Structured Scheme/Insurance Knowledge Base** — eligibility criteria
    stored as structured fields (age_min/max, income_max, occupation, etc.)
  - **Deterministic Rule Engine** — hard rule checks against the user's
    profile; a scheme only surfaces as eligible if it passes these checks
  - **Semantic retrieval** (embedding similarity) is used only to match
    free-text queries to relevant scheme/eligibility language for retrieval —
    never to decide eligibility itself.
- The LLM's only role in this module is downstream: turning an
  already-decided result into a plain-language explanation, or summarizing why
  a scheme was or wasn't matched. It never makes the yes/no eligibility call.
- Proactive by design: given a user's stored profile, produces a "gap list" of
  schemes they qualify for but aren't marked as enrolled in — without the user
  needing to ask.
- Every result includes a plain-language explanation of the benefit, cost, and
  how to apply.

### 3.3 Financial Document Explainer
- Accepts an uploaded photo or PDF of: an insurance policy, a government scheme
  document, a bank/KYC form, a loan or EMI agreement, or a credit/debit
  card/UPI terms document.
- Extracts key terms into plain language, tailored to document type (coverage/
  exclusions/premium for insurance; interest rate/tenure/penalties for loans;
  fees for card/UPI T&Cs).
- Cross-checks extracted terms against the user's stored profile and flags
  mismatches (e.g., a stated dependent not covered, an EMI amount inconsistent
  with stated income).
- For insurance/schemes specifically, compares cost/benefit against equivalent
  government scheme alternatives where one exists.
- Generates a step-by-step document checklist for filing a claim (guidance
  only — the user submits it themselves through the real channel).
- Any explanation for a non-insurance/scheme document type (loans, KYC, card
  T&Cs) must carry a spoken disclaimer: this is a general explanation, not
  legal/financial advice, confirm with the bank/an official before signing.

### 3.4 Financial Literacy Tutor
- Answers free-form questions about savings, insurance, and loan concepts.
- Strictly grounded in ingested RBI/NCFE source material — must decline or
  hedge rather than answer from unsupported general knowledge.
- Responses pass through a plain-language rewrite step before being returned.

### 3.5 Income/Expense Logging
- Voice or short-text entry of an income or expense record.
- No entry requires more than two fields (amount + category).
- Produces a simple visual summary (weekly/monthly totals, category breakdown).

---

## 4. System Architecture

```
CLIENT LAYER
  React PWA (Web/Mobile)
    - Voice Capture UI
    - Text Fallback UI
        |
        v  (HTTPS/REST)
API LAYER
  Node.js + Express REST API
        |
        v
APPLICATION MODULES (all in Node.js)
  - Voice & Language Gateway
  - Eligibility & Gap Detection Engine
  - Financial Document Explainer
  - Financial Literacy Tutor
  - Income/Expense Logging Service

  Voice & Language Gateway  <----> Bhashini API (ASR/MT/TTS)      [EXTERNAL]

  Eligibility Engine (internal decision, NOT LLM-dependent):
    Structured Scheme/Insurance KB + Deterministic Rule Engine --> decision
    decision --> Gemini (gemini-2.5-flash)   [EXTERNAL, explanation/summarization only]

  Document Explainer        <----> Gemini (gemini-2.5-flash)            [EXTERNAL]
  Literacy Tutor            <----> Gemini (gemini-2.5-flash)            [EXTERNAL]
  Income/Expense Logging    -- (no external AI call; DB only) --

  All five modules --> MongoDB Atlas                              [DATA LAYER]
```

Important: the Client Layer must never call the Data Layer or External
Services directly — every request routes through the API Layer and the
relevant Application Module.

---

## 5. Database Schema (MongoDB / Mongoose)

```
User
  user_id (PK)
  name
  phone_number
  preferred_language      // "te" | "hi" | "en"
  created_at

Profile                    // 1:1 with User
  profile_id (PK)
  user_id (FK -> User)
  age
  income_band
  occupation
  employment_type            // e.g. "gig_worker" | "street_vendor" | "daily_wage" | "other_unorganised"
  dependents
  has_bank_account           // boolean
  existing_coverage         // array of scheme/policy identifiers
  updated_at

Scheme                     // reference corpus, not user-specific
  scheme_id (PK)
  name
  type                      // "government_scheme" | "govt_insurance" | "private_insurance"
  eligibility_criteria       // JSON: structured rule fields (age_min, age_max, income_max, occupation, etc.) — this is what the Rule Engine reads; never bypass it via the LLM
  benefit_description
  premium_annual_inr        // cost in INR per year (0 for free schemes)
  coverage_inr              // benefit amount in INR
  how_to_apply              // instructions for application
  source_document_ref
  is_active                 // soft delete flag
  // Embeddings for semantic retrieval are NOT necessarily stored inline here —
  // route all embedding generation/lookup through an EmbeddingService/
  // RetrievalService abstraction so the underlying vector store (MongoDB
  // Atlas Vector Search, a dedicated vector DB, etc.) can be swapped later
  // without touching this schema or calling code.

EligibilityMatch           // junction table, User <-> Scheme (many-to-many)
  match_id (PK)
  user_id (FK -> User)
  scheme_id (FK -> Scheme)
  matched_at
  status                     // "notified" | "enrolled" | "dismissed"

Document                   // user-uploaded financial documents
  document_id (PK)
  user_id (FK -> User)
  document_type              // "insurance_policy" | "KYC" | "loan_agreement" | "card_tnc"
  uploaded_at
  extracted_text
  risk_flags                 // JSON array of flagged mismatches/concerns

KnowledgeSource             // provenance for literacy content
  source_id (PK)
  organization                // "RBI" | "NCFE"
  source_url
  source_type
  last_updated

LiteracyContent            // reference corpus, not user-specific
  content_id (PK)
  source_id (FK -> KnowledgeSource)
  title
  topic
  content_text
  language
  last_updated
  // Embeddings handled via the same EmbeddingService/RetrievalService
  // abstraction noted under Scheme above — not stored inline by default.

IncomeExpenseLog
  log_id (PK)
  user_id (FK -> User)
  amount
  category
  type                       // "income" | "expense"
  logged_at
```

Note: `Scheme` and `LiteracyContent` have no direct foreign key to `User` — they
are shared reference corpora, only ever joined through `EligibilityMatch` or
retrieved directly by module logic. `LiteracyContent` links to `KnowledgeSource`
to make RBI/NCFE provenance explicit and queryable, rather than a bare string.

---

## 6. Suggested API Routes (proposal — adjust as implementation demands)

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/profile
PUT    /api/profile

GET    /api/voice/capabilities      -> returns active provider chain & step locations
POST   /api/voice/translate         -> {text, from, to} translation
POST   /api/voice/query             -> translates, runs handler, translates back
POST   /api/voice/transcribe        -> 501 (handled client-side fallback)
POST   /api/voice/synthesize        -> 501 (handled client-side fallback)

POST   /api/eligibility/query       -> returns matched schemes + gap list
GET    /api/eligibility/gaps        -> proactive gap list for logged-in user

POST   /api/documents/upload        -> returns extracted explanation + risk flags
GET    /api/documents/:id

POST   /api/literacy/ask

POST   /api/income-expense          -> create entry
GET    /api/income-expense/summary

# Admin/content management (not user-facing)
GET    /api/admin/schemes
POST   /api/admin/schemes
GET    /api/admin/literacy-content
POST   /api/admin/literacy-content
```

---

## 7. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React (PWA), optimized for low-end Android |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (free tier) |
| LLM | Gemini (gemini-2.5-flash) |
| Embeddings | Gemini embeddings (gemini-embedding-2) for semantic search |
| Voice (ASR/MT/TTS) | Bhashini API (Government of India, free for individual/low-volume developers) |
| Hosting | Vercel or Render (free tier) |
| Auth | JWT-based |

---

## 8. Non-Functional Requirements

- Text query response time < 3 seconds; full voice round-trip (ASR → answer →
  TTS) < 8 seconds.
- Usable on low-end Android devices; no core action should require more than
  3 taps/screens.
- A voice pipeline failure must degrade gracefully to text — never a dead end.
- Uploaded documents must be access-scoped to the uploading user only; no
  plaintext storage of anything resembling a financial account number.
- Minimum font sizes/contrast suitable for older users; icon-based navigation
  so a fully illiterate user can reach any feature without reading a menu.

---

## 9. Phase 1 Scope Boundaries

**In scope:**
- Eligibility engine covering both government schemes AND government/private
  insurance as one unified corpus (this dual coverage is the core
  differentiator — do not narrow to schemes-only). Initial curated dataset:
  PMJJBY, PMSBY, PM-JAY plus a small set of scheme entries — this is the
  genuine Phase 1 dataset, not a promise of broader national coverage yet.
- Financial Document Explainer covering the 5 document types listed in §3.3
- Literacy Q&A grounded in RBI/NCFE source content
- Voice + text interaction in Telugu and Hindi only (English is the internal
  pivot language, not a third user-facing language to build separately)
- Simple income/expense logging
- Guided claim-document checklist generation

**Explicitly out of scope for this phase:**
- Live insurance purchasing or real-time quote comparison across insurers
  (requires IRDAI broking license, insurer API partnerships, payment gateway)
- Coverage for languages beyond Telugu and Hindi
- Automated submission of claims/applications to any insurer or government
  portal on the user's behalf
- Real bank/UPI account integration

---

## 10. Suggested Repository Structure

```
/client                     (React PWA)
  /src
    /components
    /pages
    /hooks
    /services               (API client wrappers)
/server                     (Node.js + Express)
  /src
    /routes
    /controllers
    /models                 (Mongoose schemas per §5)
    /services
      /voiceGateway         (Bhashini API wrapper)
      /eligibilityEngine
      /documentExplainer
      /literacyTutor
      /incomeLogging
    /middleware
    /config
  .env.example
/docs                        (architecture diagrams, this spec)
```
