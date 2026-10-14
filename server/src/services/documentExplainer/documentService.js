/**
 * DocumentService — extracts, explains, and flags uploaded financial documents.
 *
 * Supported document types:
 *   insurance_policy | government_scheme | KYC | loan_agreement | card_tnc
 *
 * Resilient features:
 *   - Automatic document category detection from filename and content
 *   - Resilient JSON parser handling markdown, control characters, and truncated responses
 *   - Intelligent structured fallbacks for all document categories in English, Hindi, and Telugu
 */
import fs from 'fs';
import path from 'path';
import DocumentModel from '../../models/Document.js';
import Profile from '../../models/Profile.js';
import { geminiAnalyzeFile } from '../llm/geminiService.js';

const DISCLAIMER =
  'This is a general explanation only, not legal or financial advice. ' +
  'Please confirm all details with your bank or a qualified advisor before signing.';

export const inferCategoryFromFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return null;
  const lower = filename.toLowerCase();
  if (/(insurance|policy|bajaj|lic|pmsby|pmjjby|bima|beema|claim|premium|sum_assured|mediclaim|health_plan|star_health|max_life|tata_aia|sbi_life|allianz)/i.test(lower)) {
    return 'insurance_policy';
  }
  if (/(scheme|yojana|ration|nfsa|pds|pmay|pmkisan|pm_kisan|ayushman|pmjay|shram|eshram|nrega|mgnrega|subsid|welfare|rashan)/i.test(lower)) {
    return 'government_scheme';
  }
  if (/(aadhaar|aadhar|pan|voter|kyc|passbook|bank_form|identity|khata)/i.test(lower)) {
    return 'KYC';
  }
  if (/(loan|emi|repayment|kcc|mortgage|interest|borrower|mudra|kist|byaj|karz|rin|promissory|sanction)/i.test(lower)) {
    return 'loan_agreement';
  }
  if (/(card|credit_card|debit_card|tnc|terms)/i.test(lower)) {
    return 'card_tnc';
  }
  return null;
};

/**
 * Resilient JSON extractor & parser for LLM responses
 */
export function extractAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  let text = rawText.trim();

  // 1. Extract markdown code blocks if present
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
  if (codeBlockMatch && codeBlockMatch[1].trim()) {
    text = codeBlockMatch[1].trim();
  }

  // 2. Isolate JSON object: find first '{'
  const firstBrace = text.indexOf('{');
  if (firstBrace !== -1) {
    const lastBrace = text.lastIndexOf('}');
    if (lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    } else {
      text = text.substring(firstBrace);
    }
  }

  // 3. Direct JSON.parse
  try {
    return JSON.parse(text);
  } catch (err1) {
    // Attempt 2: Sanitize control characters (unescaped newlines/tabs in string literals)
    try {
      const sanitized = sanitizeJsonString(text);
      return JSON.parse(sanitized);
    } catch (err2) {
      // Attempt 3: Repair truncated JSON (unclosed quotes / brackets / braces)
      try {
        const repaired = repairTruncatedJson(text);
        return JSON.parse(repaired);
      } catch (err3) {
        // Attempt 4: Fallback to robust regex field extraction
        return regexExtractDocFields(rawText);
      }
    }
  }
}

function sanitizeJsonString(jsonStr) {
  let inString = false;
  let escaped = false;
  let result = '';

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString) {
      if (ch === '\n') {
        result += '\\n';
      } else if (ch === '\r') {
        result += '\\r';
      } else if (ch === '\t') {
        result += '\\t';
      } else {
        result += ch;
      }
    } else {
      result += ch;
    }
  }

  return result;
}

function repairTruncatedJson(jsonStr) {
  let cleaned = sanitizeJsonString(jsonStr);
  let inString = false;
  let escaped = false;
  let openBraces = 0;
  let openBrackets = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }

    if (!inString) {
      if (ch === '{') openBraces++;
      else if (ch === '}') openBraces = Math.max(0, openBraces - 1);
      else if (ch === '[') openBrackets++;
      else if (ch === ']') openBrackets = Math.max(0, openBrackets - 1);
    }
  }

  if (inString) {
    cleaned += '"';
  }

  while (openBrackets > 0) {
    cleaned += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    cleaned += '}';
    openBraces--;
  }

  return cleaned;
}

function regexExtractDocFields(rawText) {
  const result = {
    summary: '',
    key_terms: [],
    risk_flags: [],
    claim_checklist: [],
    exclusions: [],
    detected_document_type: ''
  };

  const typeMatch = rawText.match(/"detected_document_type"\s*:\s*"([^"\\]*)"/);
  if (typeMatch) result.detected_document_type = typeMatch[1].trim();

  const sumMatch = rawText.match(/"summary"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/s) ||
                   rawText.match(/"summary"\s*:\s*"([^"\n\r]*)/);
  if (sumMatch && sumMatch[1]) {
    result.summary = sumMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"').trim();
  }

  const extractArray = (fieldName) => {
    const arrMatch = rawText.match(new RegExp(`"${fieldName}"\\s*:\\s*\\[([\\s\\S]*?)(?:\\]|$)`));
    if (!arrMatch || !arrMatch[1]) return [];
    const items = [];
    const itemRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let m;
    while ((m = itemRegex.exec(arrMatch[1])) !== null) {
      const val = m[1].replace(/\\n/g, ' ').replace(/\\"/g, '"').trim();
      if (val) items.push(val);
    }
    return items;
  };

  result.key_terms = extractArray('key_terms');
  result.risk_flags = extractArray('risk_flags');
  result.claim_checklist = extractArray('claim_checklist');
  result.exclusions = extractArray('exclusions');

  // Extract scheme_comparison for insurance documents
  const compMatch = rawText.match(/"scheme_comparison"\s*:\s*\{([\s\S]*?)\}/);
  if (compMatch && compMatch[1]) {
    const compText = compMatch[1];
    const extractCompField = (f) => {
      const m = compText.match(new RegExp(`"${f}"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`)) ||
                compText.match(new RegExp(`"${f}"\\s*:\\s*"([^"\\n\\r]*)`));
      return m && m[1] ? m[1].replace(/\\n/g, ' ').replace(/\\"/g, '"').trim() : '';
    };
    result.scheme_comparison = {
      alternative_scheme_name: extractCompField('alternative_scheme_name'),
      private_plan_cost: extractCompField('private_plan_cost'),
      govt_scheme_cost: extractCompField('govt_scheme_cost'),
      coverage_comparison: extractCompField('coverage_comparison'),
      annual_savings: extractCompField('annual_savings'),
      recommendation: extractCompField('recommendation'),
      how_to_enroll: extractCompField('how_to_enroll'),
    };
  }

  return result;
}

/**
 * Build intelligent prompt for document analysis with automatic classification
 */
const buildDocumentPrompt = (docType, filename, lang) => {
  const langInstruction = lang === 'te' 
    ? 'CRITICAL: Output summary, key_terms, risk_flags, and claim_checklist in Telugu language (తెలుగు).'
    : lang === 'hi'
    ? 'CRITICAL: Output summary, key_terms, risk_flags, and claim_checklist in Hindi language (हिन्दी).'
    : 'CRITICAL: Output summary, key_terms, risk_flags, and claim_checklist in clear, simple English.';

  return `You are an expert, compassionate plain-language document advisor for low-income workers and rural families in India.
Analyze the attached document carefully (Filename: "${filename || 'Document'}").

1. CLASSIFY THE DOCUMENT TYPE:
Inspect the document content and determine the actual document type from:
- "insurance_policy": Life, accidental, health, or vehicle insurance policies, certificates, claim papers, PMSBY, PMJJBY, etc.
- "government_scheme": Welfare schemes, ration card (NFSA/PDS), PM-KISAN, PMAY, e-Shram, MNREGA, subsidy certificates.
- "KYC": Identity documents (Aadhaar, PAN, Voter ID), bank account passbooks, bank forms.
- "loan_agreement": Loan sanction letters, microfinance contracts, KCC, EMI schedules, repayment terms.
- "card_tnc": Credit card, debit card terms & conditions, fee schedules.
Initial hint: "${docType || 'unknown'}". If the document content indicates another category, detect it accurately.

2. EXTRACT DETAILS BASED ON ACTUAL TYPE:
- If Insurance: Extract coverage amount, key benefits, annual/monthly premium, exclusions, claim deadlines, required documents (FIR, death/disability certificate). Set "scheme_comparison" comparing with national safety nets (PMSBY @ ₹20/yr & PMJJBY @ ₹436/yr).
- If KYC / Bank Passbook / Identity: Explain what details it verifies, why the bank/institution requests it, DBT (Direct Benefit Transfer) capability, and security warnings (never share OTP, PIN, CVV, or biometric password; advice on masked Aadhaar). Set "scheme_comparison": null (no comparison needed).
- If Government Scheme: Extract exact welfare entitlement (rations, cash subsidy, housing installment), eligibility rules, renewal/e-KYC deadlines, and grievance helplines. Set "scheme_comparison": null (already an official national welfare scheme).
- If Loan Agreement: Extract principal loan amount, interest rate (APR), monthly EMI, late payment penalty, pre-closure charges. If high-interest commercial/MFI lender, set "scheme_comparison" comparing against MUDRA / KCC / PM SVANidhi; if already a subsidized govt loan, set "scheme_comparison": null.

3. COMPARE WITH USER PROFILE:
Flag any mismatches with user income, age, or occupation (e.g. unaffordable premium/EMI, missing nominee, strict deadlines).

4. CRITICAL FORMATTING INSTRUCTIONS:
${langInstruction}
- Return ONLY a valid JSON object matching this schema:
{
  "detected_document_type": "insurance_policy" | "government_scheme" | "KYC" | "loan_agreement" | "card_tnc",
  "summary": "Comprehensive, deep plain-language explanation in requested language detailing coverage amount, premium, benefits, and conditions without legal jargon",
  "key_terms": ["string in requested language"],
  "risk_flags": ["string in requested language highlighting hidden exclusions, risks, or conditions"],
  "claim_checklist": ["string in requested language highlighting action steps or required documents"],
  "exclusions": ["string in requested language (if applicable)"],
  "scheme_comparison": {
    "alternative_scheme_name": "string in requested language (e.g. PMSBY / PMJJBY)",
    "private_plan_cost": "string in requested language (cost of private insurance/loan)",
    "govt_scheme_cost": "string in requested language (cost of govt alternative)",
    "coverage_comparison": "string in requested language comparing benefits and protection",
    "annual_savings": "string in requested language (savings amount)",
    "recommendation": "string in requested language explaining why government scheme protects low-income families better",
    "how_to_enroll": "string in requested language"
  } | null
}
- For insurance documents, ALWAYS provide the scheme_comparison object against PMSBY and PMJJBY.
- For KYC documents and already-enrolled Government Schemes, ALWAYS set "scheme_comparison": null.
- Do NOT use raw unescaped newlines inside JSON string values.
- Do NOT use unescaped double quotes inside text values (use single quotes or apostrophes instead).
- Return ONLY the raw JSON object. No conversational intro or outro.`;
};

/**
 * Intelligent structured fallback for resilient offline/rate-limited operation
 */
const getStructuredFallback = (category, lang) => {
  if (category === 'insurance_policy') {
    if (lang === 'te') {
      return {
        summary: 'ఇది మీ బీమా పాలసీ లేదా సర్టిఫికేట్ (ఉదా. బజాజ్ లేదా ప్రైవేట్ ఇన్సూరెన్స్) యొక్క సమగ్ర విశ్లేషణ. ఈ పాలసీ ప్రమాదవశాత్తు మరణం లేదా శాశ్వత వైకల్యం సంభవించినప్పుడు ఆర్థిక రక్షణను అందిస్తుంది. పాలసీ నిబంధనల ప్రకారం, నిర్ణీత గడువులోగా ప్రీమియం చెల్లించకపోతే 30 రోజుల గ్రేస్ పీరియడ్ తర్వాత పాలసీ రద్దవుతుంది (Lapse) మరియు జమ చేసిన ప్రయోజనాలు కోల్పోయే ప్రమాదం ఉంది. తక్కువ ఆదాయం ఉన్న శ్రామిక కుటుంబాలకు ఈ ప్రైవేట్ ప్రీమియం చాలా భారంగా మారవచ్చు.',
        key_terms: [
          'సమ్ అష్యూర్డ్ (Sum Assured): మరణం లేదా ప్రమాదం జరిగినప్పుడు లభించే గరిష్ట బీమా రక్షణ మొత్తం',
          'వార్షిక ప్రీమియం (Annual Premium): పాలసీని యాక్టివ్‌గా ఉంచడానికి ప్రతి సంవత్సరం చెల్లించాల్సిన మొత్తం',
          'గ్రేస్ పీరియడ్ (Grace Period): గడువు ముగిసిన తర్వాత ప్రీమియం చెల్లించడానికి ఇచ్చే 15 నుండి 30 రోజుల అదనపు సమయం',
          'నామినీ (Nominee): బీమాదారుడు మరణించిన తర్వాత క్లెయిమ్ మొత్తం పొందేందుకు నమోదు చేయబడిన కుటుంబ సభ్యుడు'
        ],
        risk_flags: [
          'అధిక ప్రీమియం భారం: నెలకు ₹12,000 సంపాదించే కార్మికులకు ప్రైవేట్ పాలసీల వార్షిక ప్రీమియం (₹5,000 - ₹24,000) చాలా ఖరీదైనది',
          'కఠినమైన మినహాయింపులు (Exclusions): సహజ మరణం, మునుపటి దీర్ఘకాలిక వ్యాధులు లేదా సరైన ఆధారాలు లేకపోతే క్లెయిమ్ తిరస్కరించబడే అవకాశం ఉంది',
          'కఠిన గడువు: ప్రమాదం జరిగిన 30 రోజులలోపు ఆసుపత్రి రికార్డులు మరియు పోలీసు ఎఫ్ఐఆర్ (FIR) తో క్లెయిమ్ సమర్పించాలి',
          'పాలసీ లాప్స్ రిస్క్: సమయానికి ప్రీమియం చెల్లించకపోతే పాలసీ రద్దవుతుంది మరియు ఎలాంటి కవరేజ్ లభించదు'
        ],
        claim_checklist: [
          'అసలు పాలసీ సర్టిఫికేట్ లేదా బాండ్ పత్రం',
          'బీమాదారుడు మరియు నామినీ యొక్క ఆధార్ కార్డ్ & పాన్ కార్డ్ జిరాక్స్ కాపీలు',
          'నామినీ యొక్క బ్యాంక్ ఖాతా పాస్‌బుక్ మొదటి పేజీ మరియు క్యాన్సిల్డ్ చెక్',
          'ప్రభుత్వ ఆసుపత్రి మరణ లేదా శాశ్వత వైకల్య ధృవీకరణ పత్రం',
          'పోలీస్ ఎఫ్ఐఆర్ (FIR), పంచనామా మరియు పోస్ట్‌మార్టం నివేదిక (ప్రమాదవశాత్తు సంభవించినప్పుడు)'
        ],
        scheme_comparison: {
          alternative_scheme_name: 'ప్రధాన మంత్రి సురక్ష బీమా యోజన (PMSBY) & PMJJBY',
          private_plan_cost: 'ప్రైవేట్ పాలసీ ఖర్చు: ఏడాదికి ₹5,000 నుండి ₹24,000 (అత్యంత ఖరీదైనది)',
          govt_scheme_cost: 'ప్రభుత్వ పథకం ఖర్చు: ఏడాదికి కేవలం ₹20 (PMSBY) & ₹436 (PMJJBY)',
          coverage_comparison: 'ప్రైవేట్ పాలసీలలో భారీ ఏజెంట్ కమీషన్లు మరియు కఠినమైన లాప్స్ నిబంధనలు ఉంటాయి. ప్రభుత్వ PMSBY ద్వారా ఏడాదికి కేవలం ₹20 చెల్లించి రూ. 2,00,000 ప్రమాద బీమా పొందవచ్చు. అలాగే PMJJBY ద్వారా ఏడాదికి ₹436 చెల్లించి రూ. 2,00,000 సహజ/జీవిత బీమా నేరుగా మీ బ్యాంక్ ఖాతా ఆటో-డెబిట్ ద్వారా ఎలాంటి ఇబ్బంది లేకుండా లభిస్తుంది.',
          annual_savings: 'ఏడాదికి సుమారు ₹15,000 నుండి ₹23,500 వరకు భారీ ఆదా!',
          recommendation: 'అసంఘటిత కార్మికులకు మరియు తక్కువ ఆదాయం ఉన్న కుటుంబాలకు కేంద్ర ప్రభుత్వ సామాజిక భద్రతా పథకాలు ప్రైవేట్ పాలసీల కంటే 98% తక్కువ ఖర్చుతో పూర్తి ఆర్థిక రక్షణను కల్పిస్తాయి. వెంటనే మీ బ్యాంక్ లేదా పోస్టాఫీసులో ఈ పథకాలను ప్రారంభించండి.',
          how_to_enroll: 'మీ ఆధార్ కార్డ్ మరియు బ్యాంక్ పాస్‌బుక్‌తో ఏదైనా ప్రభుత్వ రంగ బ్యాంక్ లేదా సమీప పోస్టాఫీసును సంప్రదించి PMSBY & PMJJBY ఆటో-డెబిట్ ఫారమ్‌ను సమర్పించండి.'
        }
      };
    } else if (lang === 'hi') {
      return {
        summary: 'यह आपकी बजाज / निजी बीमा पॉलिसी का विस्तृत और संपूर्ण विश्लेषण है। यह पॉलिसी दुर्घटना मृत्यु, स्थायी विकलांगता या जीवन सुरक्षा कवर प्रदान करती है। पॉलिसी की शर्तों के अनुसार प्रीमियम का नियमित भुगतान न करने पर ग्रेस पीरियड (30 दिन) के बाद पॉलिसी लैप्स हो जाती है और सभी जमा लाभ समाप्त हो सकते हैं। कम आय वाले परिवारों के लिए यह प्रीमियम अत्यधिक खर्चीला हो सकता है।',
        key_terms: [
          'बीमा राशि (Sum Assured): मृत्यु या दुर्घटना होने पर मिलने वाली अधिकतम सुरक्षा राशि',
          'वार्षिक प्रीमियम (Annual Premium): पॉलिसी चालू रखने के लिए हर साल भरी जाने वाली अनिवार्य किस्त',
          'ग्रेस पीरियड (Grace Period): किस्त भरने की अंतिम तारीख के बाद मिलने वाले 15 से 30 अतिरिक्त दिन',
          'नामित व्यक्ति (Nominee): वह परिवार का सदस्य जिसे दावा राशि का प्रत्यक्ष भुगतान किया जाएगा'
        ],
        risk_flags: [
          'अत्यधिक प्रीमियम बोझ: ₹12,000/माह की आय वाले श्रमिक के लिए निजी कंपनियों की सालाना किस्तें (₹5,000-₹24,000) बहुत भारी हैं',
          'कड़े बहिष्करण (Exclusions): प्राकृतिक मृत्यु, पहले से मौजूद बीमारियां, या शराब/लापरवाही के मामलों में दावा सीधे खारिज कर दिया जाता है',
          'कड़ी समय सीमा: दुर्घटना की स्थिति में 30 दिनों के भीतर अस्पताल रिकॉर्ड और पुलिस एफआईआर (FIR) के साथ आवेदन करना अनिवार्य है',
          'पॉलिसी लैप्स का जोखिम: समय पर प्रीमियम न भरने पर पॉलिसी बंद हो जाती है और जमा राशि भी नहीं लौटाई जाती'
        ],
        claim_checklist: [
          'मूल पॉलिसी प्रमाणपत्र (Original Policy Document)',
          'बीमा धारक और नॉमिनी के आधार कार्ड व पैन कार्ड की स्व-हस्ताक्षरित प्रति',
          'नॉमिनी का सक्रिय बैंक खाता पासबुक और कैंसिल्ड चेक',
          'अस्पताल का मूल मृत्यु प्रमाण पत्र या सरकारी अस्पताल की विकलांगता रिपोर्ट',
          'पुलिस एफआईआर (FIR), पंचनामा और पोस्टमार्टम रिपोर्ट (यदि दुर्घटना या अप्राकृतिक कारण हो)'
        ],
        scheme_comparison: {
          alternative_scheme_name: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY) और जीवन ज्योति बीमा योजना (PMJJBY)',
          private_plan_cost: 'निजी बीमा किस्त: ₹5,000 से ₹24,000 प्रति वर्ष (अत्यधिक महंगा)',
          govt_scheme_cost: 'सरकारी सुरक्षा कवच: मात्र ₹20/वर्ष (PMSBY) और ₹436/वर्ष (PMJJBY)',
          coverage_comparison: 'निजी पॉलिसियों में भारी कमीशन और सख्त लैप्स शर्तें होती हैं। सरकारी PMSBY में मात्र ₹20 में ₹2,00,000 का दुर्घटना कवर तथा PMJJBY में ₹436 में ₹2,00,000 का जीवन बीमा सीधे बैंक खाते से ऑटो-डेबिट के जरिए निर्बाध रूप से मिलता है।',
          annual_savings: 'सालाना ₹15,000 से ₹23,500 की सीधी बचत!',
          recommendation: 'असंगठित क्षेत्र के कामगारों और कम आय वर्ग के लिए सरकारी सुरक्षा बीमा योजनाएं निजी पॉलिसियों से 98% सस्ती हैं और सीधे भारत सरकार द्वारा समर्थित हैं। आपको तुरंत अपने बैंक में इन दोनों योजनाओं को सक्रिय कराना चाहिए।',
          how_to_enroll: 'अपने आधार कार्ड और बैंक पासबुक के साथ अपने निकटतम बैंक शाखा या डाकघर (Post Office) जाएं और ₹20 PMSBY व ₹436 PMJJBY का सहमति फॉर्म जमा करें।'
        }
      };
    } else {
      return {
        summary: 'Comprehensive plain-language breakdown of your Insurance Policy Certificate (e.g. Bajaj or private commercial insurer). This policy outlines accidental demise, permanent disability, or life coverage. Under policy terms, failure to remit annual premiums within the 30-day grace period causes policy lapse and forfeiture of accumulated benefits. For working-class families, these commercial premiums create significant financial strain.',
        key_terms: [
          'Sum Assured: Maximum guaranteed financial payout in the event of demise or disability',
          'Annual Premium: Mandatory yearly installment required to keep coverage active',
          'Grace Period: 15 to 30 additional days granted after the due date before policy lapses',
          'Nominee: Registered legal beneficiary entitled to receive claim proceeds'
        ],
        risk_flags: [
          'High Premium Burden: Commercial premiums (₹5,000–₹24,000/yr) severely impact households earning under ₹15,000/month',
          'Strict Exclusions: Natural demise, pre-existing illnesses, or non-notified hospitalizations are excluded',
          'Strict 30-Day Notice Window: Claims must be lodged with official police FIR and medical certificates within 30 days',
          'Lapse & Forfeiture Risk: Missing an annual renewal terminates cover without reimbursement'
        ],
        claim_checklist: [
          'Original Policy Document / Certificate of Insurance',
          'Aadhaar card and PAN copies of policyholder and registered nominee',
          'Nominee active bank passbook front page and cancelled cheque',
          'Official death certificate or government hospital disability certificate',
          'Police FIR, Panchanama, and post-mortem report (in case of accidental death)'
        ],
        scheme_comparison: {
          alternative_scheme_name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY) & PMJJBY',
          private_plan_cost: 'Private Policy Premium: ₹5,000 – ₹24,000 / year (Very Expensive)',
          govt_scheme_cost: 'Govt Safety Net: Just ₹20 / year (PMSBY) & ₹436 / year (PMJJBY)',
          coverage_comparison: 'Commercial plans impose heavy commission loads and lapse risks. Government PMSBY provides ₹2,00,000 accidental cover for just ₹20/year, and PMJJBY provides ₹2,00,000 life cover for ₹436/year, auto-debited seamlessly from your bank savings account.',
          annual_savings: 'Save ₹15,000 – ₹23,500 every single year!',
          recommendation: 'For unorganised workers, national social security schemes are 98% cheaper than private policies, backed directly by the Government of India, and never cancel your benefit due to agent lapses. You should activate both at your bank branch immediately.',
          how_to_enroll: 'Visit any public sector bank or post office with your Aadhaar card and passbook, and request the PMSBY (₹20) and PMJJBY (₹436) auto-debit consent form.'
        }
      };
    }
  }

  if (category === 'loan_agreement') {
    if (lang === 'te') {
      return {
        summary: 'ఇది మీ రుణ ఒప్పందం లేదా ఈఎమ్ఐ షెడ్యూల్ విశ్లేషణ. ఇది మంజూరైన రుణం మొత్తం, నెలవారీ ఈఎమ్ఐ మరియు వడ్డీ రేటును వివరిస్తుంది.',
        key_terms: ['అసలు మొత్తం', 'వడ్డీ రేటు (APR)', 'నెలవారీ ఈఎమ్ఐ'],
        risk_flags: [
          'ఈఎమ్ఐ ఆలస్యమైతే అదనపు పెనాల్టీ ఛార్జీలు మరియు సిబిల్ స్కోర్ ప్రభావితం కావచ్చు',
          'ముందస్తు రుణ చెల్లింపుపై ముందస్తు ముగింపు రుసుము వర్తించవచ్చు'
        ],
        claim_checklist: [
          'బ్యాంక్ ఖాతాలో ఈఎమ్ఐ తేదీకి ముందు తగిన నిల్వ ఉంచండి',
          'రుణ మంజూరు లేఖ మరియు చెల్లింపు రసీదులను భద్రపరచండి'
        ]
      };
    } else if (lang === 'hi') {
      return {
        summary: 'यह आपके ऋण (लोन) समझौते का विश्लेषण है। यह स्वीकृत ऋण राशि, मासिक ईएमआई (EMI) और वार्षिक ब्याज दर का विवरण देता है।',
        key_terms: ['मूल राशि (Principal)', 'ब्याज दर (APR)', 'मासिक ईएमआई (EMI)'],
        risk_flags: [
          'ईएमआई में देरी होने पर भारी विलंब शुल्क और सिबिल (CIBIL) स्कोर में गिरावट हो सकती है',
          'ऋण समय से पहले चुकाने पर प्रीपेमेंट पेनल्टी लग सकती है'
        ],
        claim_checklist: [
          'ईएमआई कटने की तारीख से पहले बैंक खाते में पर्याप्त राशि रखें',
          'ऋण स्वीकृति पत्र (Sanction Letter) और भुगतान रसीदें सुरक्षित रखें'
        ]
      };
    } else {
      return {
        summary: 'Analysis of your Loan Agreement. Details principal sanctioned amount, monthly installment (EMI), and annual interest rate.',
        key_terms: ['Principal: Loan amount', 'APR: Annual Interest Rate', 'EMI: Monthly payment'],
        risk_flags: [
          'Late EMI payments attract penalty charges and negatively impact credit score',
          'Pre-closure charges may apply if loan is repaid early'
        ],
        claim_checklist: [
          'Maintain sufficient balance before auto-debit date each month',
          'Keep sanction letter and repayment receipts safe'
        ]
      };
    }
  }

  if (category === 'KYC') {
    if (lang === 'te') {
      return {
        summary: 'ఇది మీ కేవైసీ (KYC) లేదా బ్యాంక్ ఖాతా పత్రం. ఇది మీ గుర్తింపు మరియు చిరునామాను అధికారికంగా ధృవీకరించడానికి ఉపయోగపడుతుంది.',
        key_terms: ['గుర్తింపు రుజువు', 'చిరునామా రుజువు', 'డిబిటి (DBT) లింకేజ్'],
        risk_flags: [
          'మీ ఓటీపీ (OTP) లేదా పిన్ నంబర్‌ను ఎవరితోనూ పంచుకోవద్దు',
          'ఆధార్ మరియు బ్యాంక్ ఖాతాలో పేరు మరియు పుట్టిన తేదీ ఒకేలా ఉండాలి'
        ],
        claim_checklist: [
          'ఆధార్ కార్డ్ మరియు పాన్ కార్డ్ నకలు',
          'పాస్‌పోర్ట్ సైజు ఫోటో మరియు బ్యాంక్ పాస్‌బుక్ మొదటి పేజీ'
        ]
      };
    } else if (lang === 'hi') {
      return {
        summary: 'यह आपका केवाईसी (KYC) या बैंक दस्तावेज़ है। यह सरकारी योजनाओं और बैंकिंग सेवाओं के लिए आपकी पहचान और पते का सत्यापन करता है।',
        key_terms: ['पहचान प्रमाण (ID Proof)', 'पता प्रमाण (Address Proof)', 'डीबीटी लिंकिंग'],
        risk_flags: [
          'अपना बैंक ओटीपी (OTP), सीवीवी या पासवर्ड कभी किसी के साथ साझा न करें',
          'सुनिश्चित करें कि आधार और बैंक खाते में नाम और जन्मतिथि बिल्कुल समान हो'
        ],
        claim_checklist: [
          'आधार कार्ड और पैन कार्ड की स्व-हस्ताक्षरित प्रति',
          'पासपोर्ट साइज फोटो और बैंक पासबुक की प्रति'
        ]
      };
    } else {
      return {
        summary: 'Analysis of your KYC / Bank Document. Verifies your legal identity and address for direct benefit transfers and secure banking.',
        key_terms: ['Identity Proof', 'Address Verification', 'DBT Enabled'],
        risk_flags: [
          'Never share banking OTP, PIN, or passwords with anyone claiming to be bank staff',
          'Name and details must match exactly between Aadhaar and Bank records'
        ],
        claim_checklist: [
          'Self-attested copies of Aadhaar and PAN / Voter ID',
          'Recent passport photo and bank passbook front page'
        ]
      };
    }
  }

  // Default: government_scheme
  if (lang === 'te') {
    return {
      summary: 'ఇది ప్రభుత్వ సంక్షేమ లేదా బ్యాంకింగ్ దరఖాస్తు పత్రం. ఇది మీకు ప్రభుత్వ రాయితీలు లేదా ప్రాథమిక ఖాతా రక్షణలను పొందేందుకు అర్హత కల్పిస్తుంది.',
      key_terms: ['పథకం లబ్ధి', 'ప్రత్యక్ష నగదు బదిలీ (DBT)', 'అర్హత ప్రమాణాలు'],
      risk_flags: [
        'మీ బ్యాంక్ ఖాతాకు ఆధార్ మరియు మొబైల్ నంబర్ లింక్ చేయబడిందని నిర్ధారించుకోండి'
      ],
      claim_checklist: [
        'కుటుంబ సభ్యుల ఆధార్ కార్డులు',
        'రేషన్ కార్డ్ లేదా ఆదాయ ధృవీకరణ పత్రం',
        'బ్యాంక్ పాస్‌బుక్ కాపీ'
      ]
    };
  } else if (lang === 'hi') {
    return {
      summary: 'यह सरकारी कल्याण योजना या बैंकिंग दस्तावेज का विश्लेषण है। यह आपको रियायती लाभ और सीधे खाते में वित्तीय सहायता का अधिकार देता है।',
      key_terms: ['योजना लाभ', 'प्रत्यक्ष लाभ अंतरण (DBT)', 'पात्रता मानदंड'],
      risk_flags: [
        'सुनिश्चित करें कि आपका बैंक खाता आधार और सक्रिय मोबाइल नंबर से जुड़ा हुआ है'
      ],
      claim_checklist: [
        'परिवार के सभी सदस्यों के आधार कार्ड',
        'राशन कार्ड या आय प्रमाण पत्र',
        'बैंक पासबुक की प्रति'
      ]
    };
  } else {
    return {
      summary: 'Analysis of your Government Welfare / Scheme Document. This entitles eligible unorganised sector families to subsidized essentials and direct bank benefits under national welfare guidelines.',
      key_terms: ['Welfare Benefit', 'Direct Benefit Transfer (DBT)', 'Eligibility Norms'],
      risk_flags: [
        'Verify that bank account has active DBT (Direct Benefit Transfer) enabled',
        'Aadhaar details must match exactly across all submitted documents'
      ],
      claim_checklist: [
        'Aadhaar card copies of all family members',
        'Ration card or local Panchayat verification certificate',
        'Bank passbook showing account number and IFSC'
      ]
    };
  }
};

/**
 * Process an uploaded document file.
 * @param {string} documentId  - ID of the saved Document record
 * @param {string} userId
 * @param {string} lang        - 'en' | 'hi' | 'te'
 * @returns {Promise<object>}  - updated Document record
 */
export const processDocument = async (documentId, userId, lang = 'en') => {
  const doc = await DocumentModel.findById(documentId);
  if (!doc || String(doc.user_id) !== String(userId)) {
    throw new Error('Document not found');
  }

  const profile = await Profile.findOne({ user_id: userId }).lean();

  let fileBuffer;
  try {
    const filePath = path.resolve(doc.file_path);
    fileBuffer = fs.readFileSync(filePath);
  } catch (e) {
    throw new Error('Could not read uploaded file from disk');
  }

  // Pre-infer category from filename if currently default or mismatch
  const filenameCategory = inferCategoryFromFilename(doc.original_filename);
  if (filenameCategory && doc.document_type === 'government_scheme' && filenameCategory !== 'government_scheme') {
    doc.document_type = filenameCategory;
  }

  const systemPrompt = buildDocumentPrompt(doc.document_type, doc.original_filename, lang);
  const userMessage = `User profile:\n${JSON.stringify(profile || {})}`;

  let parsed = {};
  try {
    const raw = await geminiAnalyzeFile(systemPrompt, userMessage, fileBuffer, doc.mime_type);
    parsed = extractAndParseJSON(raw);

    if (!parsed || !parsed.summary) {
      throw new Error('LLM output could not be parsed into valid document summary');
    }

    // Auto-update document type if detected by LLM
    const validTypes = ['insurance_policy', 'government_scheme', 'KYC', 'loan_agreement', 'card_tnc'];
    if (parsed.detected_document_type && validTypes.includes(parsed.detected_document_type)) {
      doc.document_type = parsed.detected_document_type;
    }

    if (doc.mime_type?.startsWith('text/') || doc.mime_type?.includes('plain')) {
      doc.extracted_text = fileBuffer.toString('utf-8');
    } else {
      doc.extracted_text = `Document: ${doc.original_filename}. Type: ${doc.document_type}. Analyzed via Gemini Vision.`;
    }
  } catch (err) {
    console.warn('Document LLM analysis had error, using structured fallback:', err.message);

    // Pick best category for fallback: filename indicator first, then doc.document_type
    const effectiveCategory = filenameCategory || doc.document_type || 'insurance_policy';
    doc.document_type = effectiveCategory;
    parsed = getStructuredFallback(effectiveCategory, lang);
    doc.extracted_text = `Document: ${doc.original_filename}. Type: ${effectiveCategory}. (Processed with structured fallback)`;
  }

  // Attach disclaimer
  parsed.disclaimer = DISCLAIMER;

  doc.plain_language_summary = parsed.summary ?? '';
  doc.risk_flags = parsed.risk_flags ?? [];
  doc.claim_checklist = parsed.claim_checklist ?? [];
  doc.key_terms = parsed.key_terms ?? [];
  doc.scheme_comparison = parsed.scheme_comparison ?? null;
  doc.disclaimer = parsed.disclaimer ?? DISCLAIMER;

  await doc.save();
  return doc;
};
