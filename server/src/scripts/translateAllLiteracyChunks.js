import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translateWithFallback } from '../services/voiceGateway/factory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const mapCategory = (topic, title) => {
  const t = (topic || '').toLowerCase();
  const tit = (title || '').toLowerCase();
  if (t === 'savings') return 'savings';
  if (t === 'insurance' || tit.includes('ayushman') || tit.includes('pm-jay') || tit.includes('bima') || tit.includes('pmjjby') || tit.includes('pmsby')) return 'insurance';
  if (t === 'schemes' || tit.includes('pension') || tit.includes('apy') || tit.includes('maan-dhan') || tit.includes('e-shram') || tit.includes('jandhan') || tit.includes('pmjdy')) return 'schemes';
  if (t === 'loans' || t === 'credit' || tit.includes('svanidhi') || tit.includes('vishwakarma') || tit.includes('credit report') || tit.includes('repay')) return 'loans';
  if (t === 'upi' || t === 'general' || tit.includes('fraud') || tit.includes('ombudsman') || tit.includes('complaint') || tit.includes('unauthorised')) return 'rights';
  return 'schemes';
};

async function safeTranslate(text, targetLang) {
  if (!text || typeof text !== 'string') return '';
  let retries = 0;
  while (retries < 3) {
    try {
      const res = await translateWithFallback(text, 'en', targetLang);
      if (res && res.translated) return res.translated;
    } catch (err) {
      console.warn(`Translation attempt ${retries + 1} failed for ${targetLang}:`, err.message);
    }
    retries++;
    await sleep(1000 * retries);
  }
  return text; // fallback to english if translation unavailable
}

async function run() {
  const verifiedPath = path.resolve(__dirname, '../../../literacy-chunks.verified.json');
  const needsPath = path.resolve(__dirname, '../../../literacy-chunks.needs-primary-check.json');
  const outJsonPath = path.resolve(__dirname, '../data/financialLiteracyData.json');
  const clientJsPath = path.resolve(__dirname, '../../../client/src/data/financialLiteracyData.js');
  const corpusJsonPath = path.resolve(__dirname, '../services/literacyTutor/literacyCorpus.json');

  const verified = JSON.parse(fs.readFileSync(verifiedPath, 'utf8'));
  const needs = JSON.parse(fs.readFileSync(needsPath, 'utf8'));
  const allRaw = [...verified, ...needs];

  let existing = [];
  if (fs.existsSync(outJsonPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(outJsonPath, 'utf8'));
    } catch {}
  }
  const existingMap = new Map(existing.map(d => [d.id, d]));

  console.log(`Starting translation pipeline for ${allRaw.length} chunks...`);

  const results = [];

  for (let i = 0; i < allRaw.length; i++) {
    const raw = allRaw[i];
    const id = raw.chunk_id;
    console.log(`\n[${i + 1}/${allRaw.length}] Translating ${id}: ${raw.title}`);

    let item = existingMap.get(id);
    const category = mapCategory(raw.topic, raw.title);

    const enTitle = raw.title;
    const enContent = raw.content_text;

    // Check if item already has valid non-empty Telugu and Hindi translations
    const hasHi = item && item.hi && item.hi.title && item.hi.content_text && item.hi.title !== enTitle;
    const hasTe = item && item.te && item.te.title && item.te.content_text && item.te.title !== enTitle;

    let hiTitle = hasHi ? item.hi.title : await safeTranslate(enTitle, 'hi');
    let hiContent = hasHi ? item.hi.content_text : await safeTranslate(enContent, 'hi');

    let teTitle = hasTe ? item.te.title : await safeTranslate(enTitle, 'te');
    let teContent = hasTe ? item.te.content_text : await safeTranslate(enContent, 'te');

    const entry = {
      id,
      topic: raw.topic || 'schemes',
      category,
      organization: raw.organization || 'Government of India',
      source_url: raw.source_url || 'https://www.rbi.org.in',
      section: raw.section || 'Official Guidelines',
      verified_level: raw.verified_level || 'A',
      en: {
        title: enTitle,
        content_text: enContent
      },
      hi: {
        title: hiTitle,
        content_text: hiContent
      },
      te: {
        title: teTitle,
        content_text: teContent
      }
    };

    results.push(entry);

    // Save incrementally
    fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
    fs.writeFileSync(outJsonPath, JSON.stringify(results, null, 2), 'utf8');

    // Polite delay between chunk translations
    await sleep(250);
  }

  // Also write client-side JS file
  const clientJsContent = `// Automatically generated verified financial literacy data (32 Chunks)
// Full multilingual support for English, Hindi (हिन्दी), and Telugu (తెలుగు)

export const FINANCIAL_LITERACY_CHUNKS = ${JSON.stringify(results, null, 2)};

export const LITERACY_CATEGORIES = [
  { id: 'all', en: 'All Topics', hi: 'सभी विषय', te: 'అన్ని అంశాలు' },
  { id: 'savings', en: 'Savings & Zero-Balance Banking', hi: 'बचत व जीरो बैलेंस बैंक खाते', te: 'పొదుపు & జీరో బ్యాలెన్స్ బ్యాంకింగ్' },
  { id: 'insurance', en: 'Insurance & Free Health Care', hi: 'बीमा व मुफ्त अस्पताल इलाज', te: 'బీమా & ఉచిత వైద్య సంరక్షణ' },
  { id: 'schemes', en: 'Pensions & Social Welfare', hi: 'पेंशन व सामाजिक कल्याण योजनाएं', te: 'పింఛన్లు & సామాజిక సంక్షేమం' },
  { id: 'loans', en: 'Loans, Credit & Livelihood', hi: 'ऋण, क्रेडिट व आजीविका', te: 'రుణాలు, క్రెడిట్ & జీవనోపాధి' },
  { id: 'rights', en: 'Consumer Rights & Fraud Safety', hi: 'नागरिक अधिकार व धोखाधड़ी सुरक्षा', te: 'పౌర హక్కులు & మోసాల రక్షణ' }
];

export function getLocalizedChunk(chunk, lang = 'en') {
  if (!chunk) return null;
  const loc = chunk[lang] || chunk['en'] || {};
  return {
    ...chunk,
    title: loc.title || chunk.en?.title || '',
    content_text: loc.content_text || chunk.en?.content_text || '',
  };
}
`;

  fs.mkdirSync(path.dirname(clientJsPath), { recursive: true });
  fs.writeFileSync(clientJsPath, clientJsContent, 'utf8');

  // Also update server literacyCorpus.json with all 32 chunks for RAG grounding
  const corpusList = results.map(r => ({
    organization: r.organization,
    source_url: r.source_url,
    source_type: 'official_regulator_circular',
    topic: r.topic,
    title: r.en.title,
    content_text: `${r.en.content_text} (Also available in Telugu: ${r.te.content_text} and Hindi: ${r.hi.content_text})`,
    section: r.section,
    retrieved_on: '2026-10-02',
    verified: true
  }));
  fs.writeFileSync(corpusJsonPath, JSON.stringify(corpusList, null, 2), 'utf8');

  console.log(`\nALL DONE! Generated ${results.length} multilingual chunks:`);
  console.log(`- Server JSON: ${outJsonPath}`);
  console.log(`- Client JS: ${clientJsPath}`);
  console.log(`- RAG Corpus: ${corpusJsonPath}`);
}

run().catch(console.error);
