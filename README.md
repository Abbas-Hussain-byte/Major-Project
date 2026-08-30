# BenefitLens 🎙️

> A voice-first financial protection and literacy platform for unorganised-sector workers in India.

BenefitLens helps gig workers, street vendors, and daily-wage earners discover government schemes and insurance benefits they already qualify for, understand financial documents in plain language, and build financial literacy — all through spoken interaction in Telugu or Hindi.

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier)
- API keys: Bhashini, Gemini (or Groq)

### Server
```bash
cd server
cp .env.example .env        # fill in your keys
npm install
npm run dev                 # starts on :5000
```

### Client
```bash
cd client
npm install
npm run dev                 # starts on :5173
```

### Health check
```
GET http://localhost:5000/api/health
→ { "status": "ok" }
```

---

## Architecture

```
React PWA  →  Express API  →  Application Modules  →  MongoDB Atlas
                               ├─ Voice Gateway  →  Bhashini API
                               ├─ Eligibility Engine (deterministic rule engine)
                               ├─ Document Explainer  →  Gemini/Groq
                               ├─ Literacy Tutor  →  Gemini/Groq (RAG)
                               └─ Income/Expense Logging
```

See [`docs/architecture.md`](docs/architecture.md) for the full diagram.

---

## Modules

| Module | Description |
|---|---|
| Voice & Language Gateway | ASR → MT → LLM → MT → TTS via Bhashini |
| Eligibility Engine | Deterministic rule checks; LLM only explains results |
| Document Explainer | OCR + plain-language extraction for 5 doc types |
| Literacy Tutor | RAG Q&A grounded in RBI/NCFE source material |
| Income/Expense Logging | Voice or text entry, weekly/monthly summary |

---

## Design Principles

1. **Audio-first** — every action reachable by voice alone
2. **Grounded generation only** — no hallucinated financial claims
3. **Translation-sandwich** — ASR → EN → LLM → native → TTS
4. **MERN only** — no Python; all logic in Node.js
5. **Zero-cost infra** — all services on free tiers
6. **Guide, never submit** — checklist generation only; no automated submissions

---

## Supported Languages

| Code | Language |
|---|---|
| `te` | Telugu |
| `hi` | Hindi |

English is the internal pivot language, not a user-facing language.

---

## License
MIT
