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
    expect(result.reasons.some(r => r.includes('Minimum age 18 not met'))).toBe(true);
  });

  it('returns ineligible if age exceeds maximum', () => {
    const profile = { age: 60 };
    const criteria = { age_max: 50 };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
    expect(result.reasons.some(r => r.includes('Maximum age 50 exceeded'))).toBe(true);
  });

  it('returns ineligible if income band exceeds maximum allowed', () => {
    const profile = { income_band: 'above_5L' };
    const criteria = { income_max_band: '3L_5L' };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
    expect(result.reasons.some(r => r.includes('exceeds maximum allowed'))).toBe(true);
  });

  it('returns ineligible if occupation is not in allowed list', () => {
    const profile = { occupation: 'Doctor' };
    const criteria = { occupation: ['Farmer', 'Driver'] };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
    expect(result.reasons.some(r => r.includes('not in allowed list'))).toBe(true);
  });

  it('returns ineligible if employment type is not in allowed list', () => {
    const profile = { employment_type: 'salaried' };
    const criteria = { employment_types: ['gig_worker', 'street_vendor'] };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
    expect(result.reasons.some(r => r.includes('not in allowed list'))).toBe(true);
  });

  it('returns ineligible if dependents are below minimum', () => {
    const profile = { dependents: 0 };
    const criteria = { min_dependents: 1 };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns ineligible if dependents exceed maximum', () => {
    const profile = { dependents: 5 };
    const criteria = { max_dependents: 3 };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns unknown with missing fields list if a required field is missing', () => {
    const profile = { age: 30 }; // missing income_band
    const criteria = { age_min: 18, income_max_band: '3L_5L' };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('unknown');
    expect(result.missing_fields).toContain('income_band');
    expect(result.missing_fields).not.toContain('age');
    expect(result.reasons.some(r => r.includes('Missing profile fields'))).toBe(true);
  });
});

describe('Rule Engine - filterEligibleSchemes', () => {
  const schemes = [
    { _id: 's1', name: 'Scheme 1', eligibility_criteria: { age_max: 20 } },
    { _id: 's2', name: 'Scheme 2', eligibility_criteria: { age_min: 30 } },
    { _id: 's3', name: 'Scheme 3', eligibility_criteria: { income_max_band: 'below_1L' } }
  ];

  it('separates eligible, ineligible, and unknown schemes', () => {
    // Age 25, no income_band
    const profile = { age: 25 };
    const result = filterEligibleSchemes(profile, schemes);
    
    // s1 (age_max 20) -> ineligible
    expect(result.ineligible.find(s => s.scheme._id === 's1')).toBeDefined();
    
    // s2 (age_min 30) -> ineligible
    expect(result.ineligible.find(s => s.scheme._id === 's2')).toBeDefined();
    
    // s3 (needs income_band) -> unknown
    expect(result.unknown.find(s => s.scheme._id === 's3')).toBeDefined();
    expect(result.eligible.length).toBe(0);
  });

  it('removes scheme from gap list (eligible) if existing_coverage includes it', () => {
    // Matches s1, but is already enrolled
    const profile = { age: 18, existing_coverage: ['s1'] };
    const result = filterEligibleSchemes(profile, schemes);

    // s1 would be eligible, but existing_coverage pushes it to ineligible
    const s1Result = result.ineligible.find(s => s.scheme._id === 's1');
    expect(s1Result).toBeDefined();
    expect(s1Result.reasons.some(r => r.includes('Already enrolled'))).toBe(true);
  });
});
