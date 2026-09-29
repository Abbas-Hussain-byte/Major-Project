import { describe, it, expect } from 'vitest';
import { checkEligibility, filterEligibleSchemes } from './ruleEngine.js';

describe('Rule Engine - checkEligibility', () => {
  it('returns unknown if criteria is empty', () => {
    const profile = { age: 30 };
    const criteria = {};
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.reasons[0]).toMatch(/Criteria is empty/);
  });

  it('returns eligible for a fully matching profile', () => {
    const profile = { age: 30, income_band: '1L_3L', occupation: 'Farmer' };
    const criteria = { age_min: 18, age_max: 50, income_max_band: '3L_5L', occupation: ['Farmer', 'Driver'] };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('eligible');
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('returns ineligible if age is below minimum', () => {
    const profile = { age: 16 };
    const criteria = { age_min: 18 };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns ineligible if age exceeds maximum', () => {
    const profile = { age: 60 };
    const criteria = { age_max: 50 };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns eligible if age is exactly min or max', () => {
    const criteria = { age_min: 18, age_max: 50 };
    expect(checkEligibility({ age: 18 }, criteria).status).toBe('eligible');
    expect(checkEligibility({ age: 50 }, criteria).status).toBe('eligible');
  });

  it('returns eligible if income equals max band', () => {
    const criteria = { income_max_band: '3L_5L' };
    expect(checkEligibility({ income_band: '3L_5L' }, criteria).status).toBe('eligible');
  });

  it('returns ineligible if income band exceeds maximum allowed', () => {
    const profile = { income_band: 'above_5L' };
    const criteria = { income_max_band: '3L_5L' };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns unknown if profile income_band is unrecognised', () => {
    const profile = { income_band: 'invalid_band' };
    const criteria = { income_max_band: '3L_5L' };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.reasons[0]).toMatch(/unrecognised income_band/);
  });

  it('returns unknown if scheme income_max_band is invalid', () => {
    const profile = { income_band: '1L_3L' };
    const criteria = { income_max_band: 'typo_band' };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.reasons[0]).toMatch(/invalid income_max_band/);
  });

  it('returns ineligible if occupation is not in allowed list', () => {
    const profile = { occupation: 'Doctor' };
    const criteria = { occupation: ['Farmer', 'Driver'] };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns unknown for unhandled custom_rules even if other criteria match', () => {
    const profile = { age: 30, has_bank_account: true };
    const criteria = { age_min: 18, age_max: 50, custom_rules: { other_rule: true } };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.reasons.some(r => r.includes('custom rules'))).toBe(true);
  });

  it('returns eligible for bank_account custom rule when has_bank_account is true', () => {
    const profile = { age: 30, has_bank_account: true };
    const criteria = { age_min: 18, age_max: 50, custom_rules: { bank_account: true } };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('eligible');
  });

  it('returns ineligible for bank_account custom rule when has_bank_account is false', () => {
    const profile = { age: 30, has_bank_account: false };
    const criteria = { age_min: 18, age_max: 50, custom_rules: { bank_account: true } };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns unknown with missing_fields if has_bank_account is undefined but required', () => {
    const profile = { age: 30 }; // missing has_bank_account
    const criteria = { age_min: 18, age_max: 50, custom_rules: { bank_account: true } };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.missing_fields).toContain('has_bank_account');
  });

  it('returns unknown for unrecognised criteria keys', () => {
    const profile = { age: 30 };
    const criteria = { minimum_age: 18 }; // typo key
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.reasons.some(r => r.includes('unrecognised criteria keys'))).toBe(true);
  });

  it('returns ineligible if violation exists, even with missing fields', () => {
    // Missing income_band, but age violates max. Violation should take precedence.
    const profile = { age: 60 }; 
    const criteria = { age_max: 50, income_max_band: '3L_5L' };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
    expect(result.reasons[0]).toMatch(/Maximum age 50 exceeded/);
  });

  it('returns unknown if missing fields but no violations', () => {
    const profile = { age: 30 }; // missing income_band
    const criteria = { age_min: 18, income_max_band: '3L_5L' };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.missing_fields).toContain('income_band');
  });
});

describe('Rule Engine - filterEligibleSchemes', () => {
  const schemes = [
    { _id: 's1', name: 'Scheme 1', eligibility_criteria: { age_max: 20 } },
    { _id: 's2', name: 'Scheme 2', eligibility_criteria: { age_min: 30 } },
    { _id: 's3', name: 'Scheme 3', eligibility_criteria: { income_max_band: 'below_1L' } }
  ];

  it('separates eligible, ineligible, and unknown schemes', () => {
    const profile = { age: 25 };
    const result = filterEligibleSchemes(profile, schemes);
    
    expect(result.ineligible.find(s => s.scheme._id === 's1')).toBeDefined();
    expect(result.ineligible.find(s => s.scheme._id === 's2')).toBeDefined();
    expect(result.unknown.find(s => s.scheme._id === 's3')).toBeDefined();
    expect(result.eligible.length).toBe(0);
  });

  it('puts enrolled schemes in the enrolled bucket instead of ineligible', () => {
    const profile = { age: 18, existing_coverage: ['s1'] };
    const result = filterEligibleSchemes(profile, schemes);

    const s1Result = result.enrolled.find(s => s.scheme._id === 's1');
    expect(s1Result).toBeDefined();
    expect(s1Result.reasons.some(r => r.includes('Already enrolled'))).toBe(true);
    expect(result.ineligible.find(s => s.scheme._id === 's1')).toBeUndefined();
    expect(result.eligible.find(s => s.scheme._id === 's1')).toBeUndefined();
  });
});
