/**
 * DocumentService — extracts, explains, and flags uploaded financial documents.
 *
 * Supported document types:
 *   insurance_policy | government_scheme | KYC | loan_agreement | card_tnc
 *
 * Pipeline per upload:
 *   1. Extract text (PDF → text; image → base64 passed to Gemini Vision)
 *   2. Plain-language summary tailored to document type
 *   3. Risk flags (mismatches against user profile)
 *   4. Claim checklist (insurance/scheme docs only)
 *   5. Government scheme alternative comparison (insurance docs only)
 *
 * Non-financial docs (loan, KYC, card_tnc) always receive the spoken disclaimer.
 */
import fs from 'fs';
import path from 'path';
import DocumentModel from '../../models/Document.js';
import Profile from '../../models/Profile.js';
import { geminiChat } from '../llm/geminiService.js';

const DISCLAIMER =
  'This is a general explanation only, not legal or financial advice. ' +
  'Please confirm all details with your bank or a qualified advisor before signing.';

const SYSTEM_PROMPTS = {
  insurance_policy: `You are a plain-language insurance advisor for low-income workers in India.
Extract and explain: coverage amount, exclusions, premium, claim process.
Flag any mismatch with the user profile provided.
Return JSON: { summary, key_terms: [], exclusions: [], risk_flags: [], claim_checklist: [] }`,

  government_scheme: `You are a plain-language government scheme advisor.
Extract: benefit, eligibility, how to apply, documents needed.
Return JSON: { summary, key_terms: [], risk_flags: [], claim_checklist: [] }`,

  KYC: `You are a plain-language financial literacy assistant.
Explain what this KYC form is collecting and why.
Append disclaimer. Return JSON: { summary, key_terms: [], risk_flags: [], disclaimer }`,

  loan_agreement: `You are a plain-language loan advisor.
Extract: interest rate (APR), tenure, EMI, prepayment penalties, late fees.
Flag if EMI seems inconsistent with user income band.
Append disclaimer. Return JSON: { summary, key_terms: [], risk_flags: [], disclaimer }`,

  card_tnc: `You are a plain-language card terms advisor.
Extract: annual fee, interest rate, late payment fee, key restrictions.
Append disclaimer. Return JSON: { summary, key_terms: [], risk_flags: [], disclaimer }`,
};

/**
 * Process an uploaded document file.
 * @param {string} documentId  - ID of the saved Document record
 * @param {string} userId
 * @returns {Promise<object>}  - updated Document record
 */
export const processDocument = async (documentId, userId) => {
  const doc = await DocumentModel.findById(documentId);
  if (!doc || String(doc.user_id) !== String(userId)) {
    throw new Error('Document not found');
  }

  const profile = await Profile.findOne({ user_id: userId }).lean();

  // Read file content (text extraction stub — real impl would use pdf-parse / Gemini Vision)
  let extractedText = '';
  try {
    const filePath = path.resolve(doc.file_path);
    if (doc.mime_type === 'application/pdf') {
      // TODO: integrate pdf-parse here for production
      extractedText = '[PDF text extraction stub — integrate pdf-parse]';
    } else {
      // Image: pass base64 to Gemini Vision in production
      const imgBuffer = fs.readFileSync(filePath);
      extractedText = `[Image OCR stub — base64 length: ${imgBuffer.length}]`;
    }
  } catch (e) {
    extractedText = '[Could not read file]';
  }

  doc.extracted_text = extractedText;

  const systemPrompt = SYSTEM_PROMPTS[doc.document_type] || SYSTEM_PROMPTS.KYC;
  const userMessage = `Document text:\n${extractedText}\n\nUser profile:\n${JSON.stringify(profile)}`;

  let parsed = {};
  try {
    const raw = await geminiChat(systemPrompt, userMessage);
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      summary: '[Could not generate summary — check GEMINI_API_KEY]',
      risk_flags: [],
      claim_checklist: [],
    };
  }

  // Attach disclaimer to non-insurance documents
  const needsDisclaimer = ['KYC', 'loan_agreement', 'card_tnc'].includes(doc.document_type);
  if (needsDisclaimer) parsed.disclaimer = DISCLAIMER;

  doc.plain_language_summary = parsed.summary ?? '';
  doc.risk_flags = parsed.risk_flags ?? [];
  doc.claim_checklist = parsed.claim_checklist ?? [];

  await doc.save();
  return doc;
};
