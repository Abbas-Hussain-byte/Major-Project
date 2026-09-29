# BenefitLens — Agent Instructions

You are building BenefitLens: a voice-first financial protection and literacy
platform for unorganised-sector workers in India (gig workers, street vendors,
daily-wage earners). Full spec: `docs/benefitlens-technical-spec.md` — read it
before writing any code. This file is the always-on summary; the spec is the
source of truth for anything more detailed.

## Non-negotiable rules (violating these is a bug, not a style choice)

1. **Eligibility decisions are never made by an LLM.** They come from
   deterministic rule checks against a structured Scheme knowledge base only.
   The LLM's only role anywhere in this codebase is explaining an
   already-decided result in plain language — never deciding it.
2. **No unsupported financial claims.** Any answer about eligibility, benefit
   amounts, or financial advice must be grounded in retrieved source data. If
   nothing relevant is retrieved, the system says so explicitly. Never let a
   generation call fill a gap with a plausible-sounding guess.
3. **Insurance stays in the core eligibility corpus alongside government
   schemes.** This is the project's central differentiator — do not narrow it
   to government-schemes-only under any circumstance, including "simplify the
   MVP" requests.
4. **Audio-first, not text-first.** Every core user flow must be completable
   by voice alone. Text is a supported fallback, never the assumed default.
5. **Stay in Node.js/Express.** Do not introduce a Python service. All AI
   capability (LLM, embeddings, ASR/MT/TTS) is consumed via REST calls to
   external APIs from Node code.
6. **Zero paid infrastructure.** Every service used must have a workable free
   tier for this phase.
7. **No automated claim/application submission** to any insurer or government
   system. The product may generate a document checklist; it must never
   attempt to submit on the user's behalf.

## Read before acting

- `docs/benefitlens-technical-spec.md` — architecture, database schema, API
  routes, module-by-module functional spec
- `.agents/skills/accessible-ui-design.md` — **read this before writing any
  frontend/UI code.** Non-negotiable, not a nice-to-have.
- `.agents/rules/architecture.md` — layer boundaries and the eligibility
  engine's internal split
- `.agents/rules/code-style.md` — repo conventions

## Working mode

- Use Planning mode for anything touching the Eligibility Engine, the
  RAG-grounding logic, or the overall project scaffold. Do not go straight to
  execution on these — the cost of getting the foundation wrong is high and
  quota to redo it is limited.
- For routine CRUD, component scaffolding, and repetitive boilerplate, execute
  directly without a planning pass.
- When uncertain about an external API's exact request/response shape
  (especially Bhashini), say so and flag it for the user to verify — do not
  invent a plausible-looking schema.
