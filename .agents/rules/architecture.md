# Architecture Rules

## Layer boundaries — enforce strictly

Client (React PWA) → API Layer (Express) → Application Modules → External
Services / Data Layer.

- The client NEVER calls MongoDB or any external AI service directly. Every
  request goes through an Express route.
- Each Application Module owns its own data-access logic. Don't let routes
  reach into `models/` directly — route → controller → service → model.

## Eligibility Engine internals (the one place code review should be strictest)

```
Eligibility Engine
 ├── Structured Scheme/Insurance Knowledge Base  (MongoDB, structured fields)
 ├── Deterministic Rule Engine                    (pure functions, no AI calls)
 └── (downstream only, after a decision exists) → LLM call for explanation text
```

The Rule Engine must be pure, unit-testable functions with no network calls —
e.g. `isEligible(profile, scheme.eligibility_criteria): boolean`. If you find
yourself calling the LLM API anywhere inside this decision path, stop — that's
the exact bug this rule exists to prevent.

## RAG grounding pattern (Literacy Tutor, Document Explainer)

1. Retrieve relevant chunks via the embedding/retrieval service.
2. If nothing sufficiently relevant is retrieved, return a "not grounded"
   response — do not call the LLM to generate an answer anyway.
3. If chunks are retrieved, pass them to the LLM with an explicit instruction
   to answer only from the provided context.
4. Never let the LLM call happen without retrieved context attached.

## Vector retrieval

Route all embedding generation and similarity search through a
`RetrievalService` abstraction (e.g. `services/retrievalService.js`). Don't
hardcode a specific vector store's API into module logic — the underlying
store (MongoDB Atlas Vector Search vs. a dedicated vector DB) should be
swappable by changing this one service, not by touching the modules that call it.

## Voice pipeline

Treat English-as-pivot-language as the current implementation strategy for the
selected LLM/API combination, not an absolute architectural law. The pipeline
is: ASR (native) → MT (to English) → LLM (English) → MT (to native) → TTS
(native). Every module downstream of the Voice & Language Gateway operates in
English only — don't leak native-language strings past the Gateway boundary.
