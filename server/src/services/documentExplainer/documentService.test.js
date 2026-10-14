import { describe, it, expect, vi } from 'vitest';
import {
  inferCategoryFromFilename,
  extractAndParseJSON
} from './documentService.js';

describe('Document Service & Resilient Parser', () => {
  describe('inferCategoryFromFilename', () => {
    it('accurately detects insurance documents from filename', () => {
      expect(inferCategoryFromFilename('bajaj insurance 1.pdf')).toBe('insurance_policy');
      expect(inferCategoryFromFilename('LIC_Jeevan_Labh_Policy.pdf')).toBe('insurance_policy');
      expect(inferCategoryFromFilename('PMSBY_certificate_scan.jpg')).toBe('insurance_policy');
      expect(inferCategoryFromFilename('allianz_claim_form.png')).toBe('insurance_policy');
    });

    it('accurately detects loan documents from filename', () => {
      expect(inferCategoryFromFilename('sbi_mudra_loan_sanction.pdf')).toBe('loan_agreement');
      expect(inferCategoryFromFilename('hdfc_emi_schedule.pdf')).toBe('loan_agreement');
      expect(inferCategoryFromFilename('kcc_repayment_terms.pdf')).toBe('loan_agreement');
    });

    it('accurately detects KYC documents from filename', () => {
      expect(inferCategoryFromFilename('aadhaar_card_front.pdf')).toBe('KYC');
      expect(inferCategoryFromFilename('pan_card_copy.jpg')).toBe('KYC');
      expect(inferCategoryFromFilename('bank_passbook_first_page.pdf')).toBe('KYC');
    });

    it('accurately detects government scheme documents from filename', () => {
      expect(inferCategoryFromFilename('ration_card_delhi.pdf')).toBe('government_scheme');
      expect(inferCategoryFromFilename('pmay_housing_sanction.pdf')).toBe('government_scheme');
      expect(inferCategoryFromFilename('pmkisan_beneficiary_status.pdf')).toBe('government_scheme');
    });

    it('returns null for generic names with no indicators', () => {
      expect(inferCategoryFromFilename('scan_102.pdf')).toBeNull();
      expect(inferCategoryFromFilename('document.pdf')).toBeNull();
    });
  });

  describe('extractAndParseJSON', () => {
    it('parses valid direct JSON', () => {
      const input = JSON.stringify({
        summary: 'Direct summary text',
        risk_flags: ['Risk 1', 'Risk 2'],
        claim_checklist: ['Item A']
      });
      const parsed = extractAndParseJSON(input);
      expect(parsed.summary).toBe('Direct summary text');
      expect(parsed.risk_flags).toEqual(['Risk 1', 'Risk 2']);
    });

    it('handles markdown code fences and conversational filler', () => {
      const input = `Here is your document analysis:
\`\`\`json
{
  "summary": "This is wrapped in markdown",
  "risk_flags": ["Missing nominee"],
  "claim_checklist": ["Death certificate"]
}
\`\`\`
I hope this helps!`;
      const parsed = extractAndParseJSON(input);
      expect(parsed.summary).toBe('This is wrapped in markdown');
      expect(parsed.risk_flags).toEqual(['Missing nominee']);
    });

    it('handles unescaped literal newlines inside string literals without throwing', () => {
      const input = `{\n  "summary": "Line 1 in Hindi: यह बीमा योजना है।\\nLine 2 in Hindi: इसमें मुख्य लाभ शामिल हैं।",\n  "risk_flags": [\n    "पहला जोखिम: प्राकृतिक मृत्यु कवर नहीं है",\n    "दूसरा जोखिम: 30 दिन की समय सीमा"\n  ]\n}`;
      const parsed = extractAndParseJSON(input);
      expect(parsed.summary).toContain('यह बीमा योजना है।');
      expect(parsed.risk_flags).toHaveLength(2);
    });

    it('repairs truncated or unterminated string responses from LLM', () => {
      // Simulates the exact position 256 error where LLM stream cut off mid-string
      const truncatedInput = `\`\`\`json
{
  "detected_document_type": "insurance_policy",
  "summary": "यह बजाज आलियांज जीवन बीमा पॉलिसी है। यह दुर्घटना मृत्यु या पूर्ण विकलांगता पर 2 लाख तक का कवर देती है। वार्षिक प्रीमियम 20 रुपये है जो सीधे खाते से काटा जाता है। इसमें कुछ मुख्य शर्तें भी शामिल हैं`;

      const parsed = extractAndParseJSON(truncatedInput);
      expect(parsed).toBeTruthy();
      expect(parsed.summary).toContain('बजाज आलियांज जीवन बीमा');
    });

    it('extracts fields via regex fallback when JSON syntax is severely damaged', () => {
      const damagedInput = `Analysis Output:
"summary": "बजाज इंश्योरेंस पॉलिसी का पूर्ण विवरण और क्लेम नियम"
"risk_flags": ["30 दिनों में क्लेम करना अनिवार्य", "एफआईआर की आवश्यकता"]
"claim_checklist": ["आधार कार्ड", "बैंक पासबुक"]`;

      const parsed = extractAndParseJSON(damagedInput);
      expect(parsed).toBeTruthy();
      expect(parsed.summary).toBe('बजाज इंश्योरेंस पॉलिसी का पूर्ण विवरण और क्लेम नियम');
      expect(parsed.risk_flags).toEqual(['30 दिनों में क्लेम करना अनिवार्य', 'एफआईआर की आवश्यकता']);
      expect(parsed.claim_checklist).toEqual(['आधार कार्ड', 'बैंक पासबुक']);
    });
  });
});
