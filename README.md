# BenefitLens: Voice-First Financial Assistant for Low-Income Unorganised Workers

BenefitLens is a multilingual, voice-first financial assistance system
designed to help low-income unorganised workers understand financial
concepts, discover relevant central government schemes, and make
better-informed financial decisions.

The project combines conversational AI, Retrieval-Augmented Generation
(RAG), structured scheme and eligibility data, and multilingual voice
technologies to provide accessible and personalized financial guidance.

> **Project Status:** Major Project --- In Development

## Problem Statement

Low-income and unorganised workers often face difficulties in accessing
and understanding financial services, government welfare schemes,
insurance, pensions, and basic financial concepts. Existing information
is frequently fragmented, document-heavy, and difficult to access for
users with limited digital or financial literacy.

BenefitLens aims to provide a simpler interface through which users can
interact using **voice or text in Indian languages** and receive
understandable, profile-aware financial guidance.

## Objectives

-   Provide a **voice-first and multilingual** financial assistance
    interface.
-   Help users discover **relevant central government schemes and
    financial protection options**.
-   Use basic user-profile information such as age, occupation, income
    range, employment type, dependents, and existing coverage for
    personalized recommendations.
-   Provide financial-literacy guidance using authoritative
    **RBI/NCFE-based content**.
-   Explain user-uploaded financial or insurance documents using RAG.
-   Reduce hallucination risk by grounding responses in retrieved and
    structured knowledge.
-   Present financial information in simple, accessible language.

## Key Features

### 1. Voice-First Interaction

Users can interact with the system through voice or text. Speech can be
converted to text and responses can be delivered through text and
speech.

### 2. Multilingual Support

The system is intended to support Indian languages such as **Hindi,
Telugu, and English**, using speech and language services where
appropriate.

### 3. Profile-Based Scheme Recommendation

BenefitLens builds a user profile from information provided during
interaction and uses it to identify potentially relevant schemes.

Example profile attributes include:

-   Age
-   Income range
-   Occupation
-   Employment type
-   Dependents
-   Existing insurance/coverage

### 4. Eligibility and Recommendation

A structured scheme knowledge base stores scheme information and
eligibility criteria. A rules-based eligibility layer helps determine
whether a scheme is potentially relevant to a user's profile.

### 5. Financial Literacy

The system uses curated financial-literacy material from authoritative
sources such as **RBI and NCFE** to explain concepts such as savings,
insurance, credit, pensions, digital financial safety, and responsible
financial decision-making.

### 6. User Document Explanation

Users can provide financial or insurance documents. The system can
retrieve relevant portions of the document through RAG and generate an
understandable explanation.

### 7. Income and Expense Support

Users can record income and expenses to support basic financial
awareness and decision-making.

## System Approach

BenefitLens separates factual knowledge, eligibility logic, retrieval,
and language generation.

``` text
User
  |
  v
Voice / Text Input
  |
  v
ASR / Language Processing
  |
  v
Intent + Profile Processing
  |
  v
Query Routing
  |
  +----------------------+----------------------+
  |                      |                      |
  v                      v                      v
Scheme / Eligibility   Document Query       Financial Literacy
  |                      |                      |
  v                      v                      v
Structured Scheme KB    User Document RAG    RBI/NCFE Knowledge Base
  |                      |                      |
  +----------+-----------+----------------------+
             |
             v
     Retrieval / Rules
             |
             v
      Grounded LLM Response
             |
             v
      Translation / TTS
             |
             v
            User
```

## Knowledge and AI Architecture

BenefitLens is designed around a **hybrid approach**:

-   **Structured Knowledge Base** --- stores scheme details and
    eligibility information.
-   **RAG Knowledge Base** --- retrieves relevant information from
    authoritative financial-literacy sources and user-provided
    documents.
-   **Eligibility Rules** --- applies structured criteria to the user's
    profile rather than relying solely on an LLM to determine
    eligibility.
-   **LLM** --- converts retrieved information and rule results into
    clear, conversational explanations.
-   **Voice/Language Layer** --- supports speech recognition,
    translation where required, and text-to-speech.

The LLM is therefore used primarily for **understanding and explaining
grounded information**, rather than acting as the sole source of scheme
or financial facts.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                               Technology / Approach
  ----------------------------------- -----------------------------------
  Frontend                            React PWA

  Backend                             Node.js, Express.js

  Database                            MongoDB / MongoDB Atlas

  Voice & Language                    Bhashini services

  LLM                                 Gemini / Groq

  Retrieval                           RAG with embeddings and vector
                                      retrieval

  Knowledge                           RBI/NCFE financial-literacy
                                      content + official central scheme
                                      information

  Development                         JavaScript / Node.js ecosystem
  -----------------------------------------------------------------------

> Specific libraries, embedding models, vector-store implementation, and
> deployment infrastructure may be finalized during implementation.

## Project Modules

-   Voice & Language Gateway
-   Profile and Intent Processing
-   Eligibility & Recommendation Engine
-   Financial Document Explainer
-   Financial Literacy Tutor
-   Income & Expense Logging
-   Knowledge and Retrieval Layer

## Target Users

The primary target audience is **low-income unorganised workers**, with
the project prototype focusing on workers who may have limited access to
understandable financial information and formal financial protection.

The initial scheme scope focuses on **central/national schemes**, rather
than state-specific schemes.

## Data Sources

The project uses or is designed to use authoritative sources for factual
grounding, including:

-   Reserve Bank of India (RBI)
-   National Centre for Financial Education (NCFE)
-   Official Government of India scheme information
-   User-provided financial or insurance documents

Official source information should be verified and kept up to date
before being used for recommendations.

## Repository Structure

``` text
major-project/
├── frontend/          # React PWA
├── backend/           # Node.js + Express API
├── knowledge-base/    # Curated knowledge and scheme data
├── rag/               # Retrieval and document-processing components
├── docs/              # Architecture, diagrams and project documentation
├── README.md
└── .gitignore
```

The exact structure may change as implementation progresses.

## Project Scope

The project focuses on:

1.  Accessible financial information through voice and text.
2.  Personalized discovery of relevant central government schemes.
3.  Financial-literacy assistance.
4.  Explanation of user-provided financial documents.
5.  Multilingual interaction for selected Indian languages.

The system is intended as an **informational and decision-support
assistant**, not as a replacement for official eligibility verification,
professional financial advice, or government application portals.

## Future Enhancements

-   Additional Indian-language support.
-   More comprehensive central scheme and insurance coverage.
-   Improved profile extraction through conversational interaction.
-   Better personalization based on user interaction history.
-   Advanced document understanding.
-   Agentic orchestration for complex multi-step queries, if required by
    the final implementation.
-   Deployment and real-world usability evaluation.

## Academic Project

**BenefitLens** is being developed as a major project with the objective
of applying AI, RAG, multilingual voice technologies, and software
engineering to a real-world financial-accessibility problem.

------------------------------------------------------------------------

### Disclaimer

BenefitLens provides informational assistance based on the knowledge and
documents available to the system. Scheme eligibility, benefits, terms,
and application requirements should always be verified against the
latest official source before taking financial or administrative action.
