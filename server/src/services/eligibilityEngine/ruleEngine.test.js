import { describe, it, expect } from 'vitest';
import { checkEligibility, filterEligibleSchemes, RuleEngine, evaluate, RULE_IDS } from './ruleEngine.js';

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
    const criteria = { age_min: 18, age_max: 50, custom_rules: { requires_bank_account: true } };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('eligible');
  });

  it('returns ineligible for bank_account custom rule when has_bank_account is false', () => {
    const profile = { age: 30, has_bank_account: false };
    const criteria = { age_min: 18, age_max: 50, custom_rules: { requires_bank_account: true } };
    const result = checkEligibility(profile, criteria);
    expect(result.status).toBe('ineligible');
  });

  it('returns unknown with missing_fields if has_bank_account is undefined but required', () => {
    const profile = { age: 30 }; // missing has_bank_account
    const criteria = { age_min: 18, age_max: 50, custom_rules: { requires_bank_account: true } };
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

describe('RuleEngine.evaluate()', () => {
  const baseSchemeCriteria = {
    age_min: 18,
    age_max: 50,
    income_max_band: '1L_3L',
    employment_types: ['daily_wage', 'street_vendor', 'self_employed'],
    occupation: ['Farmer', 'Vendor', 'Construction Worker'],
    custom_rules: { requires_bank_account: true }
  };

  // ==========================================
  // Category 1: Clearly Eligible (Profiles 1-5)
  // ==========================================
  describe('Clearly Eligible Profiles', () => {
    it('Profile 1: standard adult unorganised worker meeting all criteria', () => {
      const profile = {
        age: 32,
        income_band: '1L_3L',
        employment_type: 'daily_wage',
        occupation: 'Construction Worker',
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe('eligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MIN);
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MAX);
      expect(result.firedRuleIds).toContain(RULE_IDS.INCOME_BAND);
      expect(result.firedRuleIds).toContain(RULE_IDS.EMPLOYMENT_TYPE);
      expect(result.firedRuleIds).toContain(RULE_IDS.OCCUPATION);
      expect(result.firedRuleIds).toContain(RULE_IDS.BANK_ACCOUNT);
      expect(result.triggeredRules).toEqual(result.firedRuleIds);
    });

    it('Profile 2: self-employed street vendor in lowest income band with bank account', () => {
      const profile = {
        age: 28,
        income_band: 'below_1L',
        employment_type: 'street_vendor',
        occupation: 'Vendor',
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe('eligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.INCOME_BAND);
      expect(result.firedRuleIds).toContain(RULE_IDS.BANK_ACCOUNT);
      expect(result.firedRuleIds).toContain(RULE_IDS.EMPLOYMENT_TYPE);
    });

    it('Profile 3: young farmer with minimal criteria scheme', () => {
      const criteria = {
        age_min: 18,
        custom_rules: { requires_bank_account: true }
      };
      const profile = {
        age: 21,
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toEqual([RULE_IDS.AGE_MIN, RULE_IDS.BANK_ACCOUNT]);
    });

    it('Profile 4: exact lower boundary age (18) with all requirements met', () => {
      const profile = {
        age: 18,
        income_band: '1L_3L',
        employment_type: 'daily_wage',
        occupation: 'Farmer',
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MIN);
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MAX);
    });

    it('Profile 5: exact upper boundary age (50) with all requirements met', () => {
      const profile = {
        age: 50,
        income_band: 'below_1L',
        employment_type: 'self_employed',
        occupation: 'Vendor',
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MAX);
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MIN);
    });
  });

  // ============================================
  // Category 2: Clearly Ineligible (Profiles 6-10)
  // ============================================
  describe('Clearly Ineligible Profiles', () => {
    it('Profile 6: strictly underage (< 18) triggers RULE_AGE_MIN', () => {
      const profile = {
        age: 16,
        income_band: '1L_3L',
        employment_type: 'daily_wage',
        occupation: 'Farmer',
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MIN);
      expect(result.firedRuleIds).not.toContain(RULE_IDS.AGE_MAX);
    });

    it('Profile 7: strictly overage (> 50) triggers RULE_AGE_MAX', () => {
      const profile = {
        age: 58,
        income_band: '1L_3L',
        employment_type: 'daily_wage',
        occupation: 'Farmer',
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MAX);
      expect(result.firedRuleIds).not.toContain(RULE_IDS.AGE_MIN);
    });

    it('Profile 8: missing bank account triggers RULE_BANK_ACCOUNT violation', () => {
      const profile = {
        age: 30,
        income_band: '1L_3L',
        employment_type: 'daily_wage',
        occupation: 'Farmer',
        has_bank_account: false
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.BANK_ACCOUNT);
    });

    it('Profile 9: disallowed occupation triggers RULE_OCCUPATION violation', () => {
      const profile = {
        age: 30,
        income_band: '1L_3L',
        employment_type: 'daily_wage',
        occupation: 'Software Engineer',
        has_bank_account: true
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.OCCUPATION);
    });

    it('Profile 10: multiple simultaneous violations triggers all corresponding rule IDs', () => {
      const profile = {
        age: 62, // violates age_max (50)
        income_band: 'above_5L', // violates income_max_band (1L_3L)
        employment_type: 'salaried_regular', // violates employment_types
        has_bank_account: false // violates bank account
      };

      const result = RuleEngine.evaluate(profile, baseSchemeCriteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MAX);
      expect(result.firedRuleIds).toContain(RULE_IDS.INCOME_BAND);
      expect(result.firedRuleIds).toContain(RULE_IDS.EMPLOYMENT_TYPE);
      expect(result.firedRuleIds).toContain(RULE_IDS.BANK_ACCOUNT);
    });
  });

  // ==============================================================
  // Category 3: Boundary Cases on Income Threshold (Profiles 11-14)
  // ==============================================================
  describe('Boundary Cases on Income Threshold', () => {
    it('Profile 11: income band exactly equals scheme ceiling (1L_3L == 1L_3L)', () => {
      const criteria = { income_max_band: '1L_3L' };
      const profile = { income_band: '1L_3L' };

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe('eligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.INCOME_BAND);
    });

    it('Profile 12: income band exactly one level above ceiling (3L_5L > 1L_3L) triggers RULE_INCOME_BAND', () => {
      const criteria = { income_max_band: '1L_3L' };
      const profile = { income_band: '3L_5L' };

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.INCOME_BAND);
    });

    it('Profile 13: income band well below ceiling (below_1L < 1L_3L)', () => {
      const criteria = { income_max_band: '1L_3L' };
      const profile = { income_band: 'below_1L' };

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toContain(RULE_IDS.INCOME_BAND);
    });

    it('Profile 14: highest income band (above_5L) against any band criteria', () => {
      const criteria = { income_max_band: 'any', age_min: 18 };
      const profile = { age: 25, income_band: 'above_5L' };

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MIN);
    });
  });

  // =================================================================
  // Category 4: Boundary Cases on Employment Type (Profiles 15-18)
  // =================================================================
  describe('Boundary Cases on Employment Type', () => {
    const empCriteria = {
      employment_types: ['daily_wage', 'street_vendor', 'gig_worker']
    };

    it('Profile 15: first item in allowed employment list (daily_wage)', () => {
      const profile = { employment_type: 'daily_wage' };
      const result = RuleEngine.evaluate(profile, empCriteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toContain(RULE_IDS.EMPLOYMENT_TYPE);
    });

    it('Profile 16: last item in allowed employment list (gig_worker)', () => {
      const profile = { employment_type: 'gig_worker' };
      const result = RuleEngine.evaluate(profile, empCriteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toContain(RULE_IDS.EMPLOYMENT_TYPE);
    });

    it('Profile 17: employment type not in allowed list triggers RULE_EMPLOYMENT_TYPE', () => {
      const profile = { employment_type: 'corporate_salaried' };
      const result = RuleEngine.evaluate(profile, empCriteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.EMPLOYMENT_TYPE);
    });

    it('Profile 18: empty employment_types criteria allows any employment type', () => {
      const openCriteria = { age_min: 18, employment_types: [] };
      const profile = { age: 25, employment_type: 'freelance_consultant' };
      const result = RuleEngine.evaluate(profile, openCriteria);
      expect(result.eligible).toBe(true);
      expect(result.firedRuleIds).toContain(RULE_IDS.AGE_MIN);
    });
  });

  // ============================================================
  // Category 5: Missing and Malformed Fields (Profiles 19-23)
  // ============================================================
  describe('Missing and Malformed Fields', () => {
    it('Profile 19: missing required age field triggers RULE_MISSING_FIELDS', () => {
      const criteria = { age_min: 18, age_max: 50 };
      const profile = { income_band: '1L_3L' }; // age is undefined

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('unknown');
      expect(result.firedRuleIds).toContain(RULE_IDS.MISSING_FIELDS);
      expect(result.missing_fields).toContain('age');
    });

    it('Profile 20: missing bank account when required triggers RULE_MISSING_FIELDS', () => {
      const criteria = { age_min: 18, custom_rules: { requires_bank_account: true } };
      const profile = { age: 30 }; // has_bank_account is undefined

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('unknown');
      expect(result.firedRuleIds).toContain(RULE_IDS.MISSING_FIELDS);
      expect(result.missing_fields).toContain('has_bank_account');
    });

    it('Profile 21: malformed negative age triggers RULE_MALFORMED_FIELDS', () => {
      const criteria = { age_min: 18 };
      const profile = { age: -5 };

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.MALFORMED_FIELDS);
    });

    it('Profile 22: malformed non-numeric age string triggers RULE_MALFORMED_FIELDS', () => {
      const criteria = { age_min: 18 };
      const profile = { age: 'thirty_five' };

      const result = RuleEngine.evaluate(profile, criteria);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe('ineligible');
      expect(result.firedRuleIds).toContain(RULE_IDS.MALFORMED_FIELDS);
    });

    it('Profile 23: malformed non-object / null profile triggers RULE_MALFORMED_FIELDS', () => {
      const criteria = { age_min: 18 };

      const resultNull = RuleEngine.evaluate(null, criteria);
      expect(resultNull.eligible).toBe(false);
      expect(resultNull.firedRuleIds).toContain(RULE_IDS.MALFORMED_FIELDS);

      const resultArray = RuleEngine.evaluate(['invalid', 'array'], criteria);
      expect(resultArray.eligible).toBe(false);
      expect(resultArray.firedRuleIds).toContain(RULE_IDS.MALFORMED_FIELDS);
    });
  });
});

