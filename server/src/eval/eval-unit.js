import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('eval-out');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('Running unit tests with coverage...');

try {
  // Use --outputFile to avoid stdout clutter
  execSync('npx vitest run --reporter=json --outputFile=eval-out/vitest-results.json --coverage', { encoding: 'utf-8' });
} catch (e) {
  // Vitest returns 1 if tests fail, we still want to parse the results
}

try {
  const data = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'vitest-results.json'), 'utf-8'));

  let passed = 0;
  let total = 0;
  let numFiles = data.testResults.length;

  data.testResults.forEach(r => {
    r.assertionResults.forEach(a => {
      total++;
      if (a.status === 'passed') passed++;
    });
  });

  const modules = {};

  data.testResults.forEach(r => {
    const fileName = path.basename(r.name);
    let modPassed = 0;
    let modTotal = 0;
    r.assertionResults.forEach(a => {
      modTotal++;
      if (a.status === 'passed') modPassed++;
    });
    modules[fileName] = { passed: modPassed, total: modTotal };
  });

  let coveragePct = 100;
  const zeroCoverageFiles = [];
  
  try {
    const covData = JSON.parse(fs.readFileSync(path.resolve('coverage/coverage-summary.json'), 'utf-8'));
    coveragePct = covData.total.lines.pct;
    
    // Find files with 0% line coverage
    for (const [file, stats] of Object.entries(covData)) {
      if (file !== 'total' && stats.lines.pct === 0) {
        zeroCoverageFiles.push(path.basename(file));
      }
    }
  } catch(e) {
    console.error('Could not read coverage-summary.json. Did you configure vitest correctly?');
  }

  const result = {
    passed,
    total,
    files: numFiles,
    coverage: coveragePct,
    modules,
    zeroCoverageFiles
  };

  fs.writeFileSync(path.join(OUT_DIR, 'unit-results.json'), JSON.stringify(result, null, 2));
  console.log('Wrote unit-results.json');
} catch (e) {
  console.error('Failed to parse unit test output', e);
  process.exit(1);
}
