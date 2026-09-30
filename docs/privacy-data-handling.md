# BenefitLens — Privacy and Data Handling Policy

## 1. Overview
BenefitLens handles sensitive personal, financial, and audio data. This prototype is designed in accordance with the principles of the **Digital Personal Data Protection (DPDP) Act, 2023**, and the anticipated DPDP Rules (2025).

## 2. Data Minimization
- **Profile Data**: We collect only the minimum demographic data required to determine scheme/insurance eligibility (e.g., age, income band, occupation type, existing coverage). We do not collect granular income figures or national identity numbers (Aadhaar/PAN).
- **Audio Data**: Voice queries are processed via Bhashini API. Audio files are processed ephemerally and are not persisted in the database.
- **Uploaded Documents**: Financial documents uploaded to the Explainer module are analyzed for key terms and instantly discarded after the session.

## 3. Data Storage & Encryption
- Data is stored in MongoDB Atlas, encrypted at rest.
- API requests between the client, the Express server, and external LLM/Translation services use HTTPS (TLS 1.2+).
- **Data Scoping**: User data and documents are strongly scoped to their `user_id`. Queries never retrieve context from other users' documents.

## 4. User Consent and Rights
- **Explicit Notice**: Users are presented with a clear consent notice in their preferred language (Telugu/Hindi) explaining what data is collected and why.
- **Right to Erase**: Users have access to a "Delete My Account & Data" function that completely purges their `Profile`, `User` record, and `IncomeExpenseLog`s.
- **No Third-Party Automation**: BenefitLens generates checklists but **never** submits data to external government or insurer portals on the user's behalf.

## 5. Secret Management
- API Keys (Gemini, Bhashini, Groq) are strictly stored in server-side `.env` variables and are never shipped to the React client.
- The `geminiService.js` and `bhashiniService.js` files abstract all external network calls from the internal API layers.
