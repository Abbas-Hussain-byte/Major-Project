# Literacy Tutor RAG — Technical Implementation Discussion

## What We Have Now (Current State)

| File | Status | Notes |
|---|---|---|
| [`LiteracyContent.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/models/LiteracyContent.js) | ✅ Model exists | Has `source_id`, `title`, `topic`, `content_text`, `language` — but **no `embedding` field** |
| [`KnowledgeSource.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/models/KnowledgeSource.js) | ✅ Model exists | Organization, URL, source_type — tracks provenance |
| [`embeddingService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/embeddings/embeddingService.js) | ✅ Thin wrapper | `embed(text)` → calls `geminiEmbed()`, plus `cosineSimilarity()` |
| [`retrievalService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/embeddings/retrievalService.js) | ⚠️ Scaffold only | Loads ALL docs, no threshold check, keyword fallback instead of real embeddings |
| [`geminiService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/llm/geminiService.js) | ⚠️ Works but gaps | Missing `taskType` + `outputDimensionality` in embed call; stub returns 768-dim zeros (should be 256) |
| [`literacyService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/literacyTutor/literacyService.js) | ⚠️ Scaffold only | No `not_grounded` / `llm_unavailable` distinction; returns canned string on zero chunks |
| [`literacy.controller.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/controllers/literacy.controller.js) | ✅ Wired | Translation sandwich works, route is `POST /api/literacy/ask` |
| **Seed data** | ❌ Empty | Zero `KnowledgeSource` or `LiteracyContent` documents in MongoDB |

---

## The 6 Gaps We Need to Close

### Gap 1: `geminiEmbed()` doesn't use `taskType` or `outputDimensionality`

The [verified API shape](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/docs/gemini-verified-shapes.md) shows we should use:
- `taskType: "RETRIEVAL_DOCUMENT"` when embedding chunks for storage
- `taskType: "RETRIEVAL_QUERY"` when embedding the user's question
- `outputDimensionality: 256` to keep vectors small (3072 → 256)

**Currently:** `geminiEmbed()` sends neither. The stub returns 768 zeros, not 256.

**Fix:** Add a `taskType` parameter to `geminiEmbed(text, taskType)` and add `outputDimensionality: 256` to the request body. Update the stub to return 256-dim zeros.

### Gap 2: `LiteracyContent` model has no `embedding` field

The schema comment says "embeddings NOT stored inline" — but our dev implementation **does** compute cosine similarity in-memory from `doc.embedding`. The retrievalService already expects `doc.embedding` to exist.

**Decision needed:** Add `embedding: [Number]` to the schema. This is the simplest path for Phase 1 with a small corpus (~30–50 chunks). Atlas Vector Search on M0 free tier doesn't support `$vectorSearch` — it requires M10+ ($57/mo), so that's out.

**Fix:** Add `embedding: { type: [Number], default: [] }` to the `LiteracyContent` schema, plus an index hint comment for future Atlas migration.

### Gap 3: Retrieval has no similarity threshold → three-outcome contract not enforced

The [architecture rule](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/.agents/rules/architecture.md#L27-L34) says: *"If nothing sufficiently relevant is retrieved, return 'not grounded' — do not call the LLM."*

**Currently:** `retrievalService` filters `score > 0` (anything positive). `literacyService` checks `chunks.length === 0`. There's no real threshold. A chunk with score 0.05 would pass through to the LLM.

**Fix:** Introduce `RAG_SIMILARITY_THRESHOLD` (env-configurable, default `0.35`).

The full contract must be three-outcome:

```
┌──────────────────────────────────────────────────────────┐
│  retrieveLiteracyChunks(query, topK)                     │
│    → embed query with taskType=RETRIEVAL_QUERY           │
│    → load all docs (or Atlas pipeline in prod)           │
│    → cosine rank, keep only score ≥ THRESHOLD            │
│    → return top K that pass                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  literacyService.answerQuestion(question)                │
│    → retrieve chunks                                     │
│    → if 0 chunks above threshold → { status: NOT_GROUNDED } │
│    → else call LLM with chunks                           │
│         → if LLM errors → { status: LLM_UNAVAILABLE }   │
│         → else → { status: GROUNDED, answer, sources }   │
└──────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> The threshold exists because: a low-similarity chunk produces hallucination-prone context. The LLM's system prompt says "only answer from excerpts," but in practice LLMs still drift if the excerpts are barely relevant. The threshold is our first line of defense against that. 0.35 is a starting point; we tune it using [`rag-evaluation-set.json`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/docs/rag-evaluation-set.json).

### Gap 4: `literacyService` returns a canned string, violating AGENTS.md rule #2

[AGENTS.md line 16–18](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/AGENTS.md#L16-L18): *"Never return a stub or canned string as an answer."*

Currently on zero chunks, it returns a hardcoded string. That **is** a canned string acting as an answer.

**Fix:** Return a structured object `{ status: 'not_grounded', answer: null, sources: [] }`. The controller decides the user-facing message (so it can be translated). The service never generates text that looks like an answer when it has no grounding.

### Gap 5: No seed data — the system returns nothing on every query

The database is empty. We need:
1. **KnowledgeSource records** — one per official source URL from [source-registry.csv](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/docs/source-registry.csv)
2. **LiteracyContent chunks** — 5–8 per topic, written from actual RBI/NCFE source material, chunked to ~200–400 words each
3. **Pre-computed embeddings** — each chunk needs its 256-dim embedding stored

**Topics to cover (from schema enum):** `savings`, `insurance`, `loans`, `credit`, `upi`, `general`

**Chunk strategy:**
- Each chunk = one concept (e.g., "What is PMSBY", "How UPI works", "What is compound interest")
- ~200–400 words — small enough to be a focused embedding, large enough to be a useful excerpt
- Written in simple English, grounded in official source material
- Each chunk links to a `KnowledgeSource` via `source_id`

**Delivery:** A seed script (`server/src/scripts/seedLiteracyData.js`) that:
1. Upserts `KnowledgeSource` documents
2. Upserts `LiteracyContent` documents with `content_text`
3. Calls `geminiEmbed(text, 'RETRIEVAL_DOCUMENT')` for each chunk
4. Stores the 256-dim vector in `doc.embedding`
5. Idempotent — safe to re-run (upserts by `title`)

### Gap 6: Controller doesn't handle the three outcomes

The controller currently does `const { answer, sources } = await answerQuestion(...)` and always returns 200.

**Fix:** Handle all three:
```js
if (result.status === 'not_grounded') → 200 with { status, message, sources: [] }
if (result.status === 'llm_unavailable') → 503 with { status, message }
if (result.status === 'grounded') → 200 with { status, answer, sources }
```

---

## Data Flow Diagram

```
User asks: "What is PMSBY?" (in Telugu)
                │
                ▼
┌───────── literacy.controller.js ─────────┐
│ 1. translateToEnglish("పిఎంఎస్‌బివై ఏమిటి?", "te")  │
│    → "What is PMSBY?"                              │
│                                                    │
│ 2. literacyService.answerQuestion("What is PMSBY?")│
│    │                                               │
│    ├→ retrievalService.retrieveLiteracyChunks()    │
│    │  ├→ embeddingService.embed(query, RETRIEVAL_QUERY) │
│    │  │  └→ geminiEmbed("What is PMSBY?", RETRIEVAL_QUERY) │
│    │  │     → [0.12, 0.45, ...] (256-dim)         │
│    │  ├→ LiteracyContent.find({})                  │
│    │  ├→ cosineSimilarity(queryVec, doc.embedding)  │
│    │  └→ filter score ≥ 0.35, sort, top 5          │
│    │                                               │
│    ├→ IF no chunks ≥ threshold                     │
│    │  └→ return { status: 'not_grounded' }         │
│    │                                               │
│    ├→ ELSE: build context from chunks              │
│    │  └→ geminiChat(SYSTEM_PROMPT, context+question)│
│    │     → "PMSBY is the Pradhan Mantri Suraksha..."│
│    │                                               │
│    └→ return { status: 'grounded', answer, sources }│
│                                                    │
│ 3. translateFromEnglish(answer, "te")              │
│    → Telugu translation of the answer              │
│                                                    │
│ 4. res.json({ status, answer, sources, language }) │
└────────────────────────────────────────────────────┘
```

---

## Implementation Sequence (Phased)

### Phase A: Fix the embedding pipeline (no new features, just correctness)

| # | File | Change |
|---|---|---|
| A1 | [`geminiService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/llm/geminiService.js) | Add `taskType` param to `geminiEmbed()`, add `outputDimensionality: 256`, fix stub to 256-dim |
| A2 | [`embeddingService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/embeddings/embeddingService.js) | Pass `taskType` through `embed(text, taskType)` |
| A3 | [`LiteracyContent.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/models/LiteracyContent.js) | Add `embedding: [Number]` field |
| A4 | [`env.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/config/env.js) | Add `RAG_SIMILARITY_THRESHOLD` (default 0.35), `EMBED_DIMENSIONS` (default 256) |

### Phase B: Fix the retrieval + service contract

| # | File | Change |
|---|---|---|
| B1 | [`retrievalService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/embeddings/retrievalService.js) | Use RETRIEVAL_QUERY taskType, enforce threshold, remove keyword fallback |
| B2 | [`literacyService.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/services/literacyTutor/literacyService.js) | Three-outcome return: `grounded` / `not_grounded` / `llm_unavailable`. Never return canned text as an answer |
| B3 | [`literacy.controller.js`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/server/src/controllers/literacy.controller.js) | Handle three statuses, return appropriate HTTP codes + user-facing messages |

### Phase C: Seed data + embedding generation

| # | File | Change |
|---|---|---|
| C1 | New: `server/src/scripts/seedLiteracyData.js` | Seed ~30–40 chunks across 6 topics with KnowledgeSource provenance |
| C2 | Same script | Call Gemini embedding API for each chunk, store 256-dim vectors |

### Phase D: Tests

| # | File | What |
|---|---|---|
| D1 | `server/src/services/embeddings/embeddingService.test.js` | Unit test cosine similarity, embed wrapper |
| D2 | `server/src/services/embeddings/retrievalService.test.js` | Unit test threshold logic, empty corpus, keyword fallback removal |
| D3 | `server/src/services/literacyTutor/literacyService.test.js` | Unit test three outcomes with mocked retrieval + LLM |
| D4 | Integration test against [`rag-evaluation-set.json`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/docs/rag-evaluation-set.json) | Live evaluation (requires API key + seeded DB) |

---

## Key Design Decisions for Discussion

### 1. Why NOT Atlas Vector Search?

Atlas Vector Search requires M10+ tier ($57/month minimum). The M0 free tier does **not** support the `$vectorSearch` aggregation stage. For Phase 1 with ~30–50 chunks, loading all documents and computing cosine similarity in Node is:
- **Fast enough** — 50 × 256-dim cosine = negligible compute
- **Free** — no infrastructure cost
- **Correct** — identical ranking to what Atlas would produce

> [!NOTE]
> When the corpus grows past ~500 chunks, we should revisit. The `RetrievalService` abstraction exists precisely so we can swap to Atlas Vector Search (or Pinecone free tier) by changing one file.

### 2. Why threshold 0.35?

This is an empirical starting point based on:
- Gemini embeddings with `outputDimensionality: 256` tend to produce cosine similarities of 0.6–0.8 for closely related content and 0.1–0.3 for unrelated content
- 0.35 sits in the gap between "clearly relevant" and "noise"
- We will tune this using the evaluation set — that's exactly what [`rag-evaluation-set.json`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/docs/rag-evaluation-set.json) is for
- It's env-configurable (`RAG_SIMILARITY_THRESHOLD`), so tuning requires zero code changes

### 3. Why 256 dimensions instead of full 3072?

- **Storage:** 256 floats × 8 bytes = 2 KB per chunk vs. 3072 × 8 = 24 KB — 12× reduction
- **Compute:** 12× faster cosine similarity
- **Quality:** Google's documentation shows minimal quality loss at 256 for retrieval tasks
- **Verified:** We confirmed `outputDimensionality: 256` works with `gemini-embedding-2` in our live test

### 4. Chunk sizing: why 200–400 words?

- Too small (< 100 words): insufficient context for the LLM to generate a good answer
- Too large (> 500 words): embedding quality degrades (one vector tries to capture too many concepts)
- 200–400 words per concept is the sweet spot for single-concept financial literacy explanations

### 5. Topics for the seed corpus

Based on the schema enum and the [source registry](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/docs/source-registry.csv):

| Topic | Sample Chunks | Source |
|---|---|---|
| `insurance` | PMSBY overview, PMJJBY overview, PM-JAY overview, What is term insurance, Claim process basics | NCFE, IRDAI |
| `savings` | BSBDA (basic savings account), SB interest rates, Fixed deposits basics, RD vs FD | RBI FAQs |
| `loans` | What is interest rate, EMI calculation, Mudra Yojana loans, Predatory lending red flags | RBI, NCFE |
| `credit` | What is a credit score, CIBIL basics, How to check score for free | RBI, NCFE |
| `upi` | How UPI works, Transaction limits, Dispute resolution, Safety tips | RBI FAQs |
| `general` | What is inflation, Budgeting basics, Importance of emergency fund, Understanding bank statements | NCFE handbook |

---

## Open Questions for You

1. **Chunk count:** I'm planning ~30–40 chunks total across 6 topics. Is that enough for the demo, or do you want more depth in any specific topic (especially insurance since that's the differentiator)?

2. **Evaluation:** Should I run the [`rag-evaluation-set.json`](file:///c:/Users/Awes/Desktop/ABBAS_DOCS/Major%20project%204-1/Major-Project/docs/rag-evaluation-set.json) test cases automatically after seeding and tune the threshold, or just set 0.35 and let you evaluate manually?

3. **Scheme data overlap:** The Eligibility Engine has its own `Scheme` model. Should the Literacy Tutor also be able to answer questions about specific schemes (e.g., "What is PMSBY?") by having chunks about them? Or should those questions be routed to the Eligibility module instead?
