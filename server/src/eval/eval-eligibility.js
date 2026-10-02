import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import Profile from '../models/Profile.js';
import { checkEligibility, filterEligibleSchemes } from '../services/eligibilityEngine/ruleEngine.js';

// Minimal mock environment for eligibility engine schema verification
const testCasesPath = path.resolve('..', 'docs', 'eligibility-test-cases.json');
let testCases;
try {
  const content = fs.readFileSync(testCasesPath, 'utf8');
  testCases = JSON.parse(content);
} catch (err) {
  console.error(chalk.red('Failed to read docs/eligibility-test-cases.json: ' + err.message));
  process.exit(1);
}

// 1. Verify Field Names vs real Profile fields
const profileSchemaKeys = Object.keys(Profile.schema.paths).filter(k => !k.startsWith('_') && k !== '__v');

// Define known rule engine criteria that map to profile
const knownRuleKeys = ['age', 'income_band', 'employment_type', 'has_bank_account', 'existing_coverage_schemes'];

let mismatchFound = false;

testCases.forEach((tc, idx) => {
  if (tc.profile) {
    Object.keys(tc.profile).forEach(key => {
      // Allow it if it's in the schema OR recognized by our known rules directly
      if (!profileSchemaKeys.includes(key) && !knownRuleKeys.includes(key)) {
        console.warn(chalk.yellow(`Mismatch in test case [${tc.id || idx}]: Profile field '${key}' is not in the actual Profile schema or known rule keys.`));
        mismatchFound = true;
      }
    });
  }
});

if (mismatchFound) {
  console.error(chalk.red('\nSchema validation failed: Please fix the mismatches in docs/eligibility-test-cases.json manually before running eval. DO NOT silently map them.'));
  process.exit(1);
}

console.log(chalk.blue('Schema validation passed. Running eligibility tests...\n'));

// Simulate the schemes DB based on known rules. 
// PMJJBY: age 18-50, has_bank_account
// PMSBY: age 18-70, has_bank_account
const mockSchemes = [
  {
    _id: 'scheme_pmsby',
    scheme_id: 'PMSBY',
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    eligibility_criteria: {
      age_min: 18,
      age_max: 70,
      custom_rules: { requires_bank_account: true }
    }
  },
  {
    _id: 'scheme_pmjjby',
    scheme_id: 'PMJJBY',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    eligibility_criteria: {
      age_min: 18,
      age_max: 50,
      custom_rules: { requires_bank_account: true }
    }
  }
];

let matrix = {
  eligible: { eligible: 0, ineligible: 0, unknown: 0 },
  ineligible: { eligible: 0, ineligible: 0, unknown: 0 },
  unknown: { eligible: 0, ineligible: 0, unknown: 0 }
};

const failedCases = [];
const bucketCases = [];

testCases.forEach((tc) => {
  // Map existing_coverage_schemes to mock _ids
  const testProfile = { ...tc.profile };
  if (tc.existing_coverage_schemes) {
    testProfile.existing_coverage = tc.existing_coverage_schemes.map(s => {
      const ms = mockSchemes.find(mock => mock.scheme_id === s);
      return ms ? ms._id : s;
    });
  }

  // If it's a bucket test (e.g., E15)
  if (tc.expected_bucket) {
    const schemeObj = mockSchemes.find(s => s.scheme_id === tc.scheme);
    const { enrolled } = filterEligibleSchemes(testProfile, [schemeObj]);
    const bucket = enrolled.length > 0 ? 'enrolled' : 'other';
    if (bucket === tc.expected_bucket) {
      bucketCases.push({ id: tc.id, expected: tc.expected_bucket, actual: bucket, pass: true });
    } else {
      bucketCases.push({ id: tc.id, expected: tc.expected_bucket, actual: bucket, pass: false });
    }
    return;
  }

  // Regular matrix test (ignore PM-JAY)
  if (tc.scheme === 'PM-JAY') {
    return; // PM-JAY is out of the matrix
  }

  const schemeObj = mockSchemes.find(s => s.scheme_id === tc.scheme);
  if (!schemeObj) {
    console.error(chalk.red(`Scheme ${tc.scheme} not found in mock schemes.`));
    return;
  }

  const { status, missing_fields } = checkEligibility(testProfile, schemeObj.eligibility_criteria);
  
  if (matrix[tc.expected_status]) {
    if (matrix[tc.expected_status][status] !== undefined) {
      matrix[tc.expected_status][status]++;
    }
  }

  if (status !== tc.expected_status) {
    failedCases.push({
      id: tc.id,
      description: tc.description,
      expected: tc.expected_status,
      actual: status,
      missingFields: missing_fields
    });
  }
});

// Calculate precision / recall
const classes = ['eligible', 'ineligible', 'unknown'];
const stats = {};

classes.forEach(cls => {
  const truePositives = matrix[cls][cls];
  
  let falsePositives = 0;
  classes.forEach(c => {
    if (c !== cls) falsePositives += matrix[c][cls];
  });
  
  let falseNegatives = 0;
  classes.forEach(c => {
    if (c !== cls) falseNegatives += matrix[cls][c];
  });

  const precision = (truePositives + falsePositives) === 0 ? 0 : (truePositives / (truePositives + falsePositives));
  const recall = (truePositives + falseNegatives) === 0 ? 0 : (truePositives / (truePositives + falseNegatives));

  stats[cls] = { precision, recall };
});

console.log(chalk.bold('--- 3x3 Confusion Matrix (Expected \\ Actual) ---'));
console.table(matrix);

console.log(chalk.bold('\n--- Precision & Recall ---'));
console.table(stats);

if (bucketCases.length > 0) {
  console.log(chalk.bold('\n--- Bucket Cases (e.g. Enrolled) ---'));
  console.table(bucketCases);
}

if (failedCases.length > 0) {
  console.log(chalk.red('\n--- Failed Cases ---'));
  console.table(failedCases);
} else {
  console.log(chalk.green('\nAll matrix cases passed!'));
}

const outDir = path.resolve('eval-out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'eligibility-results.json'), JSON.stringify({ matrix, stats, failedCases, bucketCases }, null, 2));
console.log(chalk.green(`\nResults written to eval-out/eligibility-results.json`));
