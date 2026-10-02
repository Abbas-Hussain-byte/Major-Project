import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const OUT_DIR = path.resolve('eval-out');
const PNG_DIR = path.resolve(OUT_DIR, 'png');

if (!fs.existsSync(PNG_DIR)) fs.mkdirSync(PNG_DIR, { recursive: true });

const htmlTemplate = (content, script) => `
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body {
    background-color: white;
    color: #111;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 40px;
    box-sizing: border-box;
    width: 1600px;
    height: 900px;
  }
  .title {
    font-family: "Times New Roman", Times, serif;
    font-weight: bold;
    font-size: 56px;
    text-align: center;
    margin-bottom: 40px;
  }
  .chart-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 600px;
  }
  .chart-box {
    width: 45%;
    height: 100%;
  }
  .confusion-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .confusion-grid {
    display: grid;
    grid-template-columns: 150px 200px 200px;
    grid-template-rows: 50px 200px 200px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }
  .grid-header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .grid-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    font-size: 36px;
  }
  .bg-dark { background-color: #0b2f6b; color: white; }
  .bg-light { background-color: #e6f0fa; color: #111; }
</style>
</head>
<body>
  ${content}
  <script>
    ${script}
  </script>
</body>
</html>
`;

const generateChart = async (html, outName) => {
  fs.writeFileSync(path.join(OUT_DIR, 'temp-chart.html'), html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(`file://${path.join(OUT_DIR, 'temp-chart.html')}`);
  // Wait for Chart.js animation
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(PNG_DIR, outName) });
  await browser.close();
  fs.unlinkSync(path.join(OUT_DIR, 'temp-chart.html'));
};

const run = async () => {
  console.log('Generating performance charts (Leaderboard, Curves, Confusion Matrix)...');
  
  const retrievalData = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'retrieval-results.json'), 'utf8'));
  const groundingData = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'grounding-results.json'), 'utf8'));
  const baselineData = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'rag-card-data.json'), 'utf8')).baseline;

  // 1. Leaderboard
  const leaderboardHtml = htmlTemplate(`
    <div class="title">Performance Evaluation</div>
    <div class="chart-container">
      <div class="chart-box"><canvas id="chart1"></canvas></div>
      <div class="chart-box"><canvas id="chart2"></canvas></div>
    </div>
  `, `
    const ctx1 = document.getElementById('chart1').getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['BenefitLens Hybrid (RAG)', 'Keyword Baseline (Rules only)'],
        datasets: [{
          data: [${retrievalData.hit3.toFixed(2)}, ${baselineData.metrics.hit3.toFixed(2)}],
          backgroundColor: ['#1a1f36', '#e04f3d']
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false }, title: { display: true, text: 'Hit@3 (higher is better)', font: { size: 24 } } },
        scales: { x: { max: 1.0 } }
      }
    });

    const ctx2 = document.getElementById('chart2').getContext('2d');
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['BenefitLens Hybrid (RAG)', 'Keyword Baseline (Rules only)'],
        datasets: [{
          data: [${groundingData.f05.toFixed(2)}, ${baselineData.metrics.f05.toFixed(2)}],
          backgroundColor: ['#1a1f36', '#e04f3d']
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false }, title: { display: true, text: 'F0.5 Score (Precision weighted)', font: { size: 24 } } },
        scales: { x: { max: 1.0 } }
      }
    });
  `);
  await generateChart(leaderboardHtml, 'slide-leaderboard.png');

  // 2. Curves
  const sweep = retrievalData.sweepData || [];
  const thresholds = sweep.map(s => s.threshold);
  const hits = sweep.map(s => s.hitRate);
  const crs = sweep.map(s => s.crRate);

  const curvesHtml = htmlTemplate(`
    <div class="title">Performance Evaluation</div>
    <div class="chart-container">
      <div class="chart-box"><canvas id="chart1"></canvas></div>
      <div class="chart-box"><canvas id="chart2"></canvas></div>
    </div>
  `, `
    const ctx1 = document.getElementById('chart1').getContext('2d');
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(thresholds)},
        datasets: [{
          label: 'Hit@3 Rate',
          data: ${JSON.stringify(hits)},
          borderColor: '#2171b5',
          tension: 0.1
        }, {
          label: 'Correct Refusal Rate',
          data: ${JSON.stringify(crs)},
          borderColor: '#238b45',
          tension: 0.1
        }]
      },
      options: {
        plugins: { title: { display: true, text: 'Threshold Sweep Calibration', font: { size: 24 } } },
        scales: { x: { title: { display: true, text: 'Threshold' } }, y: { min: 0, max: 1 } }
      }
    });
  `);
  if (sweep.length > 0) {
    await generateChart(curvesHtml, 'slide-curves.png');
  }

  // 3. Confusion Matrix
  // Using answerableGroundedCorrect vs the rest
  const cm = groundingData.confusionMatrix || { truePositives: 0, falsePositives: 0, trueNegatives: 0, falseNegatives: 0 };
  const confusionHtml = htmlTemplate(`
    <div class="title">Performance Evaluation</div>
    <div class="confusion-container">
      <div style="font-weight: bold; font-size: 24px; margin-bottom: 20px;">Confusion matrix (test set)</div>
      <div class="confusion-grid">
        <div></div>
        <div class="grid-header">Not flagged (OOS)</div>
        <div class="grid-header">Flagged (Answerable)</div>
        
        <div class="grid-header" style="justify-content: flex-end; padding-right: 20px;">Legitimate (OOS)</div>
        <div class="grid-cell bg-dark">${cm.trueNegatives}</div>
        <div class="grid-cell bg-light">${cm.falsePositives}</div>
        
        <div class="grid-header" style="justify-content: flex-end; padding-right: 20px;">Fraud (Answerable)</div>
        <div class="grid-cell bg-light">${cm.falseNegatives}</div>
        <div class="grid-cell bg-light">${cm.truePositives}</div>
      </div>
      <div style="margin-top: 20px; font-size: 18px; color: #555;">Errors/LLM Unavailable: ${cm.errors || 0}</div>
    </div>
  `, '');
  await generateChart(confusionHtml, 'slide-confusion.png');

  const eligibilityData = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'eligibility-results.json'), 'utf8'));

  // 4. Rule Engine Performance (Analogue to "Rule Lift")
  const ruleHtml = htmlTemplate(`
    <div class="title">Performance Evaluation: Rule Engine</div>
    <div class="chart-container" style="justify-content: center;">
      <div class="chart-box" style="width: 80%;"><canvas id="chart1"></canvas></div>
    </div>
  `, `
    const ctx1 = document.getElementById('chart1').getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Eligible (Precision)', 'Eligible (Recall)', 'Ineligible (Precision)', 'Ineligible (Recall)', 'Unknown (Precision)', 'Unknown (Recall)'],
        datasets: [{
          data: [
            ${eligibilityData.stats.eligible.precision.toFixed(2)},
            ${eligibilityData.stats.eligible.recall.toFixed(2)},
            ${eligibilityData.stats.ineligible.precision.toFixed(2)},
            ${eligibilityData.stats.ineligible.recall.toFixed(2)},
            ${eligibilityData.stats.unknown.precision.toFixed(2)},
            ${eligibilityData.stats.unknown.recall.toFixed(2)}
          ],
          backgroundColor: '#c48b29'
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false }, title: { display: true, text: 'Eligibility Rule Accuracy (1.0 = Perfect)', font: { size: 24 } } },
        scales: { x: { max: 1.0, min: 0 } }
      }
    });
  `);
  await generateChart(ruleHtml, 'slide-rules.png');

  // 5. System-wide Accuracy Features (Analogue to "Important Features")
  const accuracyHtml = htmlTemplate(`
    <div class="title">Performance Evaluation: Accuracy Profile</div>
    <div class="chart-container" style="justify-content: center;">
      <div class="chart-box" style="width: 80%;"><canvas id="chart1"></canvas></div>
    </div>
  `, `
    const ctx1 = document.getElementById('chart1').getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Retrieval Hit@1', 'Retrieval Hit@3', 'Retrieval MRR', 'Grounding Precision', 'Grounding Recall', 'Grounding F0.5'],
        datasets: [{
          data: [
            ${retrievalData.hit1.toFixed(2)},
            ${retrievalData.hit3.toFixed(2)},
            ${retrievalData.mrr.toFixed(2)},
            ${groundingData.precision.toFixed(2)},
            ${groundingData.recall.toFixed(2)},
            ${groundingData.f05.toFixed(2)}
          ],
          backgroundColor: '#5d3fd3'
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false }, title: { display: true, text: 'Pipeline Accuracy Metrics (Higher is better)', font: { size: 24 } } },
        scales: { x: { max: 1.0, min: 0 } }
      }
    });
  `);
  await generateChart(accuracyHtml, 'slide-accuracy.png');

  console.log('Charts generated successfully in eval-out/png/');
};

run().catch(console.error);
