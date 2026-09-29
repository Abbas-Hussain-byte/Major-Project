# Code Style Rules

- Stack: Node.js + Express (backend), React (frontend PWA), MongoDB + Mongoose.
  No Python anywhere in this repo.
- One feature per file. Don't accumulate unrelated logic in a shared "utils"
  dump — if a helper is specific to the Eligibility Engine, it lives in that
  module's own folder.
- Every Express route: route → controller → service → model. No business
  logic inside route handlers.
- Environment variables for every external API key (Bhashini, Gemini/Groq,
  MongoDB URI). Never hardcode a key or commit `.env` — always update
  `.env.example` alongside any new variable.
- Mongoose schemas live in `server/src/models/`, one file per entity, matching
  the schema in `docs/benefitlens-technical-spec.md` §5 exactly. If you deviate
  from that schema, update the spec file in the same change, don't let them drift.
- Comment *why*, not *what*, especially around the eligibility rule engine and
  grounding logic — a future reader (or teammate) needs to understand why a
  check exists, not just what it does.
- Prefer explicit error handling over silent failure, especially for the voice
  pipeline: an ASR/MT/TTS call that fails must surface a clear fallback path
  (see AGENTS.md rule 4), never fail silently.
