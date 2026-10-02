import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function translateText(text, from, to) {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/voice/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, from, to })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.translated) return data.translated;
    }
  } catch (e) {
    console.warn(`Translation error for ${to}:`, e.message);
  }
  return null;
}

async function run() {
  const verifiedPath = path.resolve(__dirname, '../../../literacy-chunks.verified.json');
  const needsPath = path.resolve(__dirname, '../../../literacy-chunks.needs-primary-check.json');
  const outJsonPath = path.resolve(__dirname, '../data/financialLiteracyData.json');

  const verified = JSON.parse(fs.readFileSync(verifiedPath, 'utf8'));
  const needs = JSON.parse(fs.readFileSync(needsPath, 'utf8'));
  const allRaw = [...verified, ...needs];

  // Load existing if partially built
  let existingData = [];
  if (fs.existsSync(outJsonPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(outJsonPath, 'utf8'));
    } catch {}
  }
  const existingMap = new Map(existingData.map(d => [d.id, d]));

  console.log(`Processing ${allRaw.length} chunks...`);

  const results = [];

  for (let i = 0; i < allRaw.length; i++) {
    const c = allRaw[i];
    const id = c.chunk_id;
    console.log(`[${i + 1}/${allRaw.length}] Processing ${id}: ${c.title}`);

    let item = existingMap.get(id);
    if (!item) {
      item = {
        id,
        topic: c.topic,
        organization: c.organization,
        source_url: c.source_url,
        section: c.section,
        verified_level: c.verified_level || 'A',
        en: {
          title: c.title,
          content_text: c.content_text
        },
        hi: {
          title: '',
          content_text: ''
        },
        te: {
          title: '',
          content_text: ''
        }
      };
    }

    // Translate Title to Hindi
    if (!item.hi.title) {
      const hiTitle = await translateText(c.title, 'en', 'hi');
      item.hi.title = hiTitle || c.title;
      await sleep(200);
    }

    // Translate Content to Hindi
    if (!item.hi.content_text) {
      const hiContent = await translateText(c.content_text, 'en', 'hi');
      item.hi.content_text = hiContent || c.content_text;
      await sleep(200);
    }

    // Translate Title to Telugu
    if (!item.te.title) {
      const teTitle = await translateText(c.title, 'en', 'te');
      item.te.title = teTitle || c.title;
      await sleep(200);
    }

    // Translate Content to Telugu
    if (!item.te.content_text) {
      const teContent = await translateText(c.content_text, 'en', 'te');
      item.te.content_text = teContent || c.content_text;
      await sleep(200);
    }

    results.push(item);

    // Save incrementally
    fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
    fs.writeFileSync(outJsonPath, JSON.stringify(results, null, 2), 'utf8');
  }

  console.log(`Successfully completed! Saved ${results.length} chunks to ${outJsonPath}`);
}

run().catch(console.error);
