import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { runKeywordBaseline } from './baselineKeywordRetrieval.js';
import { chromium } from 'playwright';

const OUT_DIR = path.resolve('eval-out');
const PNG_DIR = path.resolve(OUT_DIR, 'png');

if (!fs.existsSync(PNG_DIR)) {
  fs.mkdirSync(PNG_DIR, { recursive: true });
}

const requiredFiles = ['unit-results.json', 'retrieval-results.json', 'grounding-results.json'];

const missing = [];
for (const f of requiredFiles) {
  if (!fs.existsSync(path.join(OUT_DIR, f))) {
    missing.push(f);
  }
}

if (missing.length > 0) {
  console.error(chalk.red(`\nMissing result files: ${missing.join(', ')}`));
  console.error(chalk.red(`Rule: "If a result file is missing or older than the current git commit, say so and stop; don't fill gaps."`));
  console.error(chalk.red(`Please run eval:all (or the corresponding eval:* scripts) before running eval:rag-card.`));
  process.exit(1);
}

// Below this point is the implementation of the card builder. It will only run when files exist.

const unitData = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'unit-results.json'), 'utf8'));
const retrievalData = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'retrieval-results.json'), 'utf8'));
const groundingData = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'grounding-results.json'), 'utf8'));

const chunksPath = path.resolve('..', 'docs', 'literacy-chunks.json');
const evalSetPath = path.resolve('..', 'docs', 'rag-evaluation-set.json');
const baseline = runKeywordBaseline(chunksPath, evalSetPath);

const data = {
  baseline,
  unit: unitData,
  retrieval: retrievalData,
  grounding: groundingData
};

fs.writeFileSync(path.join(OUT_DIR, 'rag-card-data.json'), JSON.stringify(data, null, 2));

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background-color: white;
    color: #111;
    font-family: Arial, sans-serif; /* Clean sans-serif for card text */
    margin: 0;
    padding: 40px;
    box-sizing: border-box;
  }
  .card-container {
    width: 1520px; /* 1600 - 80 padding */
    height: 820px; /* 900 - 80 padding */
    display: flex;
    flex-direction: column;
  }
  .title {
    font-family: "Times New Roman", Times, serif;
    font-weight: bold;
    font-size: 56px;
    text-align: center;
    margin-bottom: 20px;
  }
  .header-line {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .description {
    font-size: 24px;
    margin-bottom: 40px;
    color: #444;
  }
  .tiles {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    flex-grow: 1;
  }
  .tile {
    text-align: center;
    border: 2px solid #ddd;
    border-radius: 12px;
    padding: 30px;
    width: 250px;
  }
  .tile-number {
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .tile-label {
    font-size: 22px;
    color: #555;
    margin-bottom: 10px;
  }
  .confidence-interval {
    font-size: 16px;
    color: #888;
  }
  .caption {
    font-size: 18px;
    color: #666;
    text-align: center;
    margin-top: auto;
  }
</style>
</head>
<body>
  <!-- Playwright will dynamically replace content here -->
  <div id="content"></div>
</body>
</html>
`;

// Compute Wilson 95% CI
function wilsonCI(p, n) {
  if (n === 0) return [0, 0];
  const z = 1.96;
  const denominator = 1 + z*z/n;
  const center = p + z*z / (2*n);
  const spread = z * Math.sqrt((p * (1 - p)) / n + z*z / (4*n*n));
  return [
    Math.max(0, (center - spread) / denominator),
    Math.min(1, (center + spread) / denominator)
  ];
}

const buildTilesHtml = (tiles) => {
  return '<div class="tiles">' + tiles.map(t => {
    let ciHtml = '';
    if (t.p !== undefined && t.n !== undefined) {
      const [low, high] = wilsonCI(t.p, t.n);
      ciHtml = `<div class="confidence-interval">[ ${low.toFixed(2)}, ${high.toFixed(2)} ]</div>`;
    }
    return `
      <div class="tile">
        <div class="tile-number">${t.value}</div>
        <div class="tile-label">${t.label}</div>
        ${ciHtml}
      </div>
    `;
  }).join('') + '</div>';
};

const generateCard = async (title, header, description, tiles, outName, showFooter = true) => {
  const footerHtml = showFooter 
    ? `<div class="caption">Held-out half; thresholds fixed on calibration half; small sample, see confidence intervals. Date: ${new Date().toISOString().split('T')[0]}</div>`
    : '';

  const html = htmlTemplate.replace('<div id="content"></div>', `
    <div class="card-container">
      <div class="title">${title}</div>
      <div class="header-line">${header}</div>
      <div class="description">${description}</div>
      ${buildTilesHtml(tiles)}
      ${footerHtml}
    </div>
  `);

  fs.writeFileSync(path.join(OUT_DIR, 'temp.html'), html);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(`file://${path.join(OUT_DIR, 'temp.html')}`);
  await page.screenshot({ path: path.join(PNG_DIR, outName) });
  await browser.close();
  
  fs.unlinkSync(path.join(OUT_DIR, 'temp.html'));
};

const run = async () => {
  console.log('Generating cards...');
  
  // Card 1: Retrieval
  // Held-out set size
  const evalSet = JSON.parse(fs.readFileSync(evalSetPath, 'utf8'));
  const heldOut = evalSet.filter((_, i) => i % 2 !== 0);
  const n = heldOut.length;
  const nAns = heldOut.filter(i => i.expected_status === 'grounded').length;
  const nOos = n - nAns;
  
  const retrievalTiles = [
    { label: 'Hit@1', value: retrievalData.hit1.toFixed(2), p: retrievalData.hit1, n: nAns },
    { label: 'Hit@3', value: retrievalData.hit3.toFixed(2), p: retrievalData.hit3, n: nAns },
    { label: 'MRR', value: retrievalData.mrr.toFixed(2) },
    { label: 'Keyword Hit@3 (Baseline)', value: baseline.metrics.hit3.toFixed(2), p: baseline.metrics.hit3, n: nAns }
  ];
  
  let smallSampleText = n < 30 ? ' (small sample)' : '';
  const rEmbed = retrievalData.metadata?.embeddingModel || 'default';
  const rDims = retrievalData.metadata?.dims || 256;
  const rChunks = retrievalData.metadata?.chunkCount || 256;
  const rDesc = `Level: retrieval. Evaluated ${new Date().toISOString().split('T')[0]}. Embedding: ${rEmbed} (${rDims} dims). Threshold: ${retrievalData.threshold.toFixed(2)} (chosen on calibration half). Corpus: ${rChunks} chunks. Held-out set: ${n} questions (${nAns} answerable, ${nOos} out-of-scope)${smallSampleText}.`;
  
  await generateCard('BenefitLens RAG Evaluation', 'BenefitLens: literacy_retrieval', rDesc, retrievalTiles, 'rag-card-retrieval.png');
  
  // Card 2: Grounding
  const groundingTiles = [
    { label: 'Precision', value: groundingData.precision.toFixed(2), p: groundingData.precision, n: nAns },
    { label: 'Recall', value: groundingData.recall.toFixed(2), p: groundingData.recall, n: nAns },
    { label: 'F0.5', value: groundingData.f05.toFixed(2) },
    { label: 'Correct refusal', value: groundingData.cr.toFixed(2), p: groundingData.cr, n: nOos },
    { label: 'False grounding', value: groundingData.fg.toFixed(2), p: groundingData.fg, n: nOos },
    { label: 'Keyword F0.5 (Baseline)', value: baseline.metrics.f05.toFixed(2) }
  ];
  
  const gModel = groundingData.metadata?.chatModel || 'default';
  const bBreak = groundingData.outOfScopeBreakdown;
  const breakdownText = bBreak ? `Out-of-scope breakdown: ${bBreak.refused} refused, ${bBreak.grounded} falsely grounded, ${bBreak.llm_unavailable} LLM unavailable, ${bBreak.error} errors.` : '';
  const gDesc = `Level: grounding. Evaluated ${new Date().toISOString().split('T')[0]}. Model: ${gModel}. Held-out set: ${n} questions (${nAns} answerable, ${nOos} out-of-scope)${smallSampleText}. ${breakdownText}`;
  
  await generateCard('BenefitLens RAG Evaluation', 'BenefitLens: literacy_grounding', gDesc, groundingTiles, 'rag-card-grounding.png');
  
  // Card 3: Unit Testing
  const unitTiles = [
    { label: 'Tests Passed', value: `${unitData.passed}/${unitData.total}` },
    { label: 'Test Files', value: `${unitData.files}` },
    { label: 'Line Coverage', value: `${unitData.coverage.toFixed(1)}%` }
  ];

  for (const [modName, modStats] of Object.entries(unitData.modules)) {
    unitTiles.push({ label: modName.replace('.test.js', ''), value: `${modStats.passed}/${modStats.total}` });
  }
  
  const uDesc = `Software Unit Tests. Evaluated ${new Date().toISOString().split('T')[0]}. Framework: Vitest. Zero Coverage Files: ${unitData.zeroCoverageFiles ? unitData.zeroCoverageFiles.join(', ') || 'None' : 'N/A'}`;
  await generateCard('Unit Testing', 'BenefitLens: Core Modules', uDesc, unitTiles, 'rag-card-unit.png', false);
  
  console.log('Cards generated successfully in eval-out/png/');
};

run().catch(console.error);
