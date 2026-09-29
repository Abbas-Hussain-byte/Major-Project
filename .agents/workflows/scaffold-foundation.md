# Workflow: Scaffold Foundation

Use this as the first task when starting the codebase. Run in Planning mode —
review the plan before execution, since this sets the pattern every later
module will copy.

## Steps

1. Read `AGENTS.md`, `docs/benefitlens-technical-spec.md`, and
   `.agents/rules/architecture.md` in full before proposing anything.
2. Generate the repository structure per the spec's §10 (client/, server/,
   docs/), with empty-but-correctly-named folders for each of the 5
   application modules under `server/src/services/`.
3. Implement the Mongoose models exactly matching spec §5 (User, Profile,
   Scheme, EligibilityMatch, Document, KnowledgeSource, LiteracyContent,
   IncomeExpenseLog). Stop and flag if any field is ambiguous rather than
   guessing.
4. Implement the Express route skeleton per spec §6 — route handlers can be
   stubs (return a "not implemented" response) at this stage; the goal is the
   correct shape, not full logic yet.
5. Implement the Eligibility Rule Engine as pure, unit-tested functions
   first, with NO LLM or API calls — per `.agents/rules/architecture.md`.
   This is the piece most worth getting right before anything else.
6. Set up `.env.example` listing every required key (MongoDB URI, Gemini/Groq
   key, Bhashini credentials) with placeholder values, never real ones.
7. Set up the React PWA shell with the accessible-UI skill applied from the
   first screen — don't build a default template and "accessibility-pass" it
   later; build it correctly from the start per
   `.agents/skills/accessible-ui-design.md`.
8. Stop and report back before wiring any external API (Bhashini,
   Gemini/Groq) — confirm the exact request/response shape with the user
   first rather than assuming one.

## Explicit non-goals for this pass

- Don't implement the full RAG pipeline yet — stub it, get the shape right.
- Don't polish visual design pixel-by-pixel yet — get the structural/
  accessibility pattern right first, refine styling in a later pass.
- Don't attempt the voice pipeline end-to-end yet — that's the highest-risk
  integration and deserves its own dedicated, focused session.
