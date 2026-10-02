import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import Scheme from '../models/Scheme.js';

const SCHEMES = [
  {
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    type: 'govt_insurance',
    eligibility_criteria: {
      age_min: 18,
      age_max: 50,
      custom_rules: { requires_bank_account: true }
    },
    benefit_description: 'Life insurance cover of Rs. 2 Lakh for any cause of death. Auto-debited from your bank account.',
    premium_annual_inr: 436,
    coverage_inr: 200000,
    how_to_apply: 'Apply through your bank branch, post office, or banking correspondent with your savings account.',
    source_document_ref: 'https://financialservices.gov.in/beta/en/pmjjby',
    is_active: true
  },
  {
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    type: 'govt_insurance',
    eligibility_criteria: {
      age_min: 18,
      age_max: 70,
      custom_rules: { requires_bank_account: true }
    },
    benefit_description: 'Accidental death and permanent disability insurance cover of up to Rs. 2 Lakh for only Rs. 20 per year.',
    premium_annual_inr: 20,
    coverage_inr: 200000,
    how_to_apply: 'Enroll via any public or private bank or post office where you have an active bank account.',
    source_document_ref: 'https://financialservices.gov.in/beta/en/pmsby',
    is_active: true
  },
  {
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 100,
      income_max_band: '3L_5L'
    },
    benefit_description: 'Cashless healthcare cover of Rs. 5 Lakhs per family per year for secondary and tertiary hospitalization in empanelled hospitals.',
    premium_annual_inr: 0,
    coverage_inr: 500000,
    how_to_apply: 'Check name on beneficiary portal or visit any CSC center / govt hospital with Aadhaar and Ration card.',
    source_document_ref: 'https://nha.gov.in/PM-JAY',
    is_active: true
  },
  {
    name: 'Atal Pension Yojana (APY)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 40,
      custom_rules: { requires_bank_account: true }
    },
    benefit_description: 'Guaranteed lifetime monthly pension of Rs. 1,000 to Rs. 5,000 after reaching age 60, with pension continuation for spouse.',
    premium_annual_inr: 504,
    coverage_inr: 60000,
    how_to_apply: 'Visit the bank branch where you have a savings account and submit the APY enrollment form.',
    source_document_ref: 'https://pfrda.org.in/index1.cshtml?lsid=16',
    is_active: true
  },
  {
    name: 'Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 40,
      income_max_band: '1L_3L',
      custom_rules: { requires_bank_account: true }
    },
    benefit_description: 'Old-age pension scheme for unorganised daily wage workers, drivers, vendors, and domestic workers with Rs. 3,000 monthly pension.',
    premium_annual_inr: 660,
    coverage_inr: 36000,
    how_to_apply: 'Visit any Common Service Centre (CSC) with your Aadhaar and savings bank passbook.',
    source_document_ref: 'https://maandhan.in',
    is_active: true
  },
  {
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 75
    },
    benefit_description: 'Zero balance savings account with free RuPay debit card, Rs. 2 Lakh inbuilt accidental cover, and Rs. 10,000 overdraft facility.',
    premium_annual_inr: 0,
    coverage_inr: 200000,
    how_to_apply: 'Open account at any bank branch or Bank Mitra kiosk with basic KYC (Aadhaar or Voter ID).',
    source_document_ref: 'https://pmjdy.gov.in',
    is_active: true
  },
  {
    name: 'PM SVANidhi (Micro-Credit for Street Vendors)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 70
    },
    benefit_description: 'Collateral-free working capital loan starting at Rs. 10,000 with 7% interest subsidy and cashback on digital transactions.',
    premium_annual_inr: 0,
    coverage_inr: 50000,
    how_to_apply: 'Apply on pmsvanidhi.mohua.gov.in or through urban local bodies / ULBs or local bank branch.',
    source_document_ref: 'https://pmsvanidhi.mohua.gov.in',
    is_active: true
  },
  {
    name: 'PM Vishwakarma Scheme',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 75
    },
    benefit_description: 'Recognition card, skill training stipend Rs. 500/day, toolkit grant of Rs. 15,000, and collateral-free enterprise loan up to Rs. 3 Lakh at 5% interest.',
    premium_annual_inr: 0,
    coverage_inr: 300000,
    how_to_apply: 'Register at CSC center with Aadhaar, skill certificate, and bank details.',
    source_document_ref: 'https://pmvishwakarma.gov.in',
    is_active: true
  },
  {
    name: 'National Food Security Act (NFSA / Antyodaya Anna Yojana)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 100,
      income_max_band: '1L_3L'
    },
    benefit_description: '35 kg highly subsidized/free food grains (rice, wheat, coarse grains) per month for vulnerable and low-income families.',
    premium_annual_inr: 0,
    coverage_inr: 15000,
    how_to_apply: 'Apply through your state Civil Supplies / Food portal or local Gram Panchayat / Tehsildar office.',
    source_document_ref: 'https://nfsa.gov.in',
    is_active: true
  },
  {
    name: 'e-Shram Social Security Registration',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 59
    },
    benefit_description: 'Universal 12-digit UAN card for unorganised workers with Rs. 2 Lakh free accidental insurance and direct DBT integration for welfare.',
    premium_annual_inr: 0,
    coverage_inr: 200000,
    how_to_apply: 'Self-register on eshram.gov.in or through nearest CSC with Aadhaar and bank details.',
    source_document_ref: 'https://eshram.gov.in',
    is_active: true
  },
  {
    name: 'Pradhan Mantri Mudra Yojana (PMMY - Shishu / Kishore)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 65
    },
    benefit_description: 'Collateral-free micro-enterprise loans up to Rs. 50,000 (Shishu) and Rs. 5 Lakh (Kishore) for informal businesses, shops, and workshops.',
    premium_annual_inr: 0,
    coverage_inr: 500000,
    how_to_apply: 'Apply at any commercial bank, regional rural bank (RRB), or via Udyamimitra portal.',
    source_document_ref: 'https://mudra.org.in',
    is_active: true
  },
  {
    name: 'Pradhan Mantri Awas Yojana (PMAY-G / Housing Assistance)',
    type: 'government_scheme',
    eligibility_criteria: {
      age_min: 18,
      age_max: 80,
      income_max_band: '1L_3L'
    },
    benefit_description: 'Financial grant assistance of up to Rs. 1,20,000 to Rs. 1,30,000 for construction of permanent pucca house with basic amenities.',
    premium_annual_inr: 0,
    coverage_inr: 130000,
    how_to_apply: 'Identified through Gram Sabha or apply via local block development office / municipal corporation.',
    source_document_ref: 'https://pmayg.nic.in',
    is_active: true
  }
];

export const seedSchemes = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    await Scheme.deleteMany({});
    console.log('Cleared existing schemes.');

    await Scheme.insertMany(SCHEMES);
    console.log(`✅ Seeded ${SCHEMES.length} Central Government schemes successfully.`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedSchemes.js')) {
  seedSchemes();
}
