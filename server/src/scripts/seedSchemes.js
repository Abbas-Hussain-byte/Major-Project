import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import Scheme from '../models/Scheme.js';

const PMJJBY = {
  name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
  type: 'govt_insurance',
  eligibility_criteria: {
    age_min: 18,
    age_max: 50,
    // Bank account requirement is known but Profile has no bank_account field.
    // The engine will treat missing fields as unknown, so we can't fully automate this check yet without adding the field.
    custom_rules: { requires_bank_account: true }
  },
  benefit_description: 'Life insurance cover of Rs. 2 Lakh for any cause of death.',
  premium_annual_inr: 436,
  coverage_inr: 200000,
  how_to_apply: 'Apply through your bank or post office where you have an account.',
  source_document_ref: 'https://financialservices.gov.in/beta/en/pmjjby'
};

const PMSBY = {
  name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
  type: 'govt_insurance',
  eligibility_criteria: {
    age_min: 18,
    age_max: 70,
    custom_rules: { requires_bank_account: true }
  },
  benefit_description: 'Accidental death and disability insurance cover of up to Rs. 2 Lakh.',
  premium_annual_inr: 20,
  coverage_inr: 200000,
  how_to_apply: 'Apply through your bank or post office where you have an account.',
  source_document_ref: 'https://financialservices.gov.in/beta/en/pmsby'
};

const PMJAY = {
  name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
  type: 'government_scheme',
  eligibility_criteria: {
    // PM-JAY expanded to seniors 70+ in 2024.
    // The standard eligibility depends on deprivation/occupational categories (SECC 2011) which are hard to model precisely.
    // This is indicative.
    age_min: 70, // Approximating the 70+ expansion, but standard PM-JAY applies to all ages if in deprived categories.
    custom_rules: { indicative_only: true, requires_secc_or_asha: true }
  },
  benefit_description: 'Health cover of Rs. 5 Lakhs per family per year for secondary and tertiary care hospitalization.',
  premium_annual_inr: 0,
  coverage_inr: 500000,
  how_to_apply: 'Visit nearest empanelled hospital or CSC with Aadhaar and ration card.',
  source_document_ref: 'https://nha.gov.in/PM-JAY'
};

export const seedSchemes = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    await Scheme.deleteMany({});
    console.log('Cleared existing schemes.');

    await Scheme.insertMany([PMJJBY, PMSBY, PMJAY]);
    console.log('✅ Seeded PMJJBY, PMSBY, and PM-JAY successfully.');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  }
};

if (process.argv[1].endsWith('seedSchemes.js')) {
  seedSchemes();
}
