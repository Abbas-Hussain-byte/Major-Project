/**
 * Rule Engine — deterministic eligibility checks.
 *
 * CRITICAL: This module makes all yes/no eligibility decisions.
 * The LLM must NEVER be called here or used to override these results.
 * LLM involvement is limited to downstream explanation of already-decided results.
 */

const INCOME_BAND_ORDER = {
  below_1L: 0,
  '1L_3L': 1,
  '3L_5L': 2,
  above_5L: 3,
};

const KNOWN_CRITERIA_KEYS = new Set([
  'age_min', 'age_max', 'income_max_band', 'occupation',
  'employment_types', 'min_dependents', 'max_dependents', 'custom_rules'
]);

export const RULE_IDS = {
  AGE_MIN: 'RULE_AGE_MIN',
  AGE_MAX: 'RULE_AGE_MAX',
  INCOME_BAND: 'RULE_INCOME_BAND',
  EMPLOYMENT_TYPE: 'RULE_EMPLOYMENT_TYPE',
  OCCUPATION: 'RULE_OCCUPATION',
  BANK_ACCOUNT: 'RULE_BANK_ACCOUNT',
  DEPENDENTS_MIN: 'RULE_DEPENDENTS_MIN',
  DEPENDENTS_MAX: 'RULE_DEPENDENTS_MAX',
  MISSING_FIELDS: 'RULE_MISSING_FIELDS',
  MALFORMED_FIELDS: 'RULE_MALFORMED_FIELDS',
  UNKNOWN_CRITERIA: 'RULE_UNKNOWN_CRITERIA'
};

/**
 * Check whether a user profile satisfies a single scheme's eligibility criteria.
 *
 * @param {object} profile  - Mongoose Profile document (lean)
 * @param {object} criteria - scheme.eligibility_criteria (lean)
 * @returns {{ status: 'eligible'|'ineligible'|'unknown', reasons: string[], missing_fields?: string[] }}
 */
export const checkEligibility = (profile, criteria) => {
  const violations = [];
  const missing_fields = [];
  const reasons = []; // display purposes only

  if (!criteria || Object.keys(criteria).length === 0) {
    return { status: 'unknown', reasons: ['Criteria is empty or not defined.'], missing_fields: [] };
  }

  // --- Identify unrecognised keys ---
  const unrecognisedKeys = Object.keys(criteria).filter(k => !KNOWN_CRITERIA_KEYS.has(k));
  
  // --- Age checks ---
  if (criteria.age_min !== undefined) {
    if (profile.age === undefined || profile.age === null) {
      missing_fields.push('age');
    } else if (profile.age < criteria.age_min) {
      violations.push(`Minimum age ${criteria.age_min} not met (profile age: ${profile.age}).`);
    } else {
      reasons.push(`Meets minimum age of ${criteria.age_min}.`);
    }
  }
  if (criteria.age_max !== undefined) {
    if (profile.age === undefined || profile.age === null) {
      if (!missing_fields.includes('age')) missing_fields.push('age');
    } else if (profile.age > criteria.age_max) {
      violations.push(`Maximum age ${criteria.age_max} exceeded (profile age: ${profile.age}).`);
    } else {
      reasons.push(`Meets maximum age limit of ${criteria.age_max}.`);
    }
  }

  // --- Income band check ---
  if (criteria.income_max_band && criteria.income_max_band !== 'any') {
    if (!profile.income_band) {
      missing_fields.push('income_band');
    } else {
      const maxOrder = INCOME_BAND_ORDER[criteria.income_max_band];
      const userOrder = INCOME_BAND_ORDER[profile.income_band];
      
      if (maxOrder === undefined) {
        return { status: 'unknown', reasons: [`Scheme has an invalid income_max_band: ${criteria.income_max_band}.`], missing_fields: [] };
      } else if (userOrder === undefined) {
        return { status: 'unknown', reasons: [`Profile has an unrecognised income_band: ${profile.income_band}.`], missing_fields: [] };
      } else if (userOrder > maxOrder) {
        violations.push(`Income band ${profile.income_band} exceeds maximum allowed ${criteria.income_max_band}.`);
      } else {
        reasons.push(`Income band ${profile.income_band} is within allowed limit.`);
      }
    }
  }

  // --- Occupation check ---
  if (criteria.occupation?.length > 0) {
    if (!profile.occupation) {
      missing_fields.push('occupation');
    } else {
      const match = criteria.occupation.some(
        (o) => o.toLowerCase() === profile.occupation.toLowerCase()
      );
      if (!match) {
        violations.push(`Occupation '${profile.occupation}' not in allowed list: ${criteria.occupation.join(', ')}.`);
      } else {
        reasons.push(`Occupation '${profile.occupation}' is eligible.`);
      }
    }
  }

  // --- Employment type check ---
  if (criteria.employment_types?.length > 0) {
    if (!profile.employment_type) {
      missing_fields.push('employment_type');
    } else if (!criteria.employment_types.includes(profile.employment_type)) {
      violations.push(`Employment type '${profile.employment_type}' not in allowed list: ${criteria.employment_types.join(', ')}.`);
    } else {
      reasons.push(`Employment type '${profile.employment_type}' is eligible.`);
    }
  }

  // --- Dependents checks ---
  if (criteria.min_dependents !== undefined) {
    if (profile.dependents === undefined || profile.dependents === null) {
      missing_fields.push('dependents');
    } else if (profile.dependents < criteria.min_dependents) {
      violations.push(`Minimum dependents ${criteria.min_dependents} not met.`);
    } else {
      reasons.push(`Meets minimum dependents requirement.`);
    }
  }
  if (criteria.max_dependents !== undefined) {
    if (profile.dependents === undefined || profile.dependents === null) {
      if (!missing_fields.includes('dependents')) missing_fields.push('dependents');
    } else if (profile.dependents > criteria.max_dependents) {
      violations.push(`Maximum dependents ${criteria.max_dependents} exceeded.`);
    } else {
      reasons.push(`Meets maximum dependents limit.`);
    }
  }

  // --- Bank Account check (Custom Rule) ---
  if (criteria.custom_rules?.requires_bank_account === true) {
    if (profile.has_bank_account === undefined || profile.has_bank_account === null) {
      missing_fields.push('has_bank_account');
    } else if (profile.has_bank_account !== true) {
      violations.push('Requires an active bank account.');
    } else {
      reasons.push('Has active bank account.');
    }
  }

  // Priority 1: Any violation -> ineligible
  if (violations.length > 0) {
    return { status: 'ineligible', reasons: violations, missing_fields: [] };
  }

  // Priority 2: Missing required profile fields -> unknown
  if (missing_fields.length > 0) {
    return { 
      status: 'unknown', 
      reasons: [`Missing profile fields required to determine eligibility: ${missing_fields.join(', ')}`], 
      missing_fields 
    };
  }

  // Priority 3: Custom rules or unrecognised keys -> unknown
  const unknownReasons = [];
  if (criteria.custom_rules) {
    const unhandledCustomRules = Object.keys(criteria.custom_rules).filter(k => k !== 'requires_bank_account');
    if (unhandledCustomRules.length > 0) {
      unknownReasons.push(`Contains custom rules that require manual evaluation: ${unhandledCustomRules.join(', ')}.`);
    }
  }
  if (unrecognisedKeys.length > 0) {
    unknownReasons.push(`Contains unrecognised criteria keys: ${unrecognisedKeys.join(', ')}.`);
  }
  
  if (unknownReasons.length > 0) {
    return { status: 'unknown', reasons: unknownReasons, missing_fields: [] };
  }

  // Priority 4: Meets all rules -> eligible
  return { status: 'eligible', reasons: reasons.length ? reasons : ['Meets all evaluated criteria.'], missing_fields: [] };
};

/**
 * Filter a list of schemes to those that are eligible for a given profile.
 *
 * @param {object} profile
 * @param {object[]} schemes  - array of Mongoose Scheme documents (lean)
 * @returns {{ eligible: object[], ineligible: object[], unknown: object[], enrolled: object[] }}
 */
export const filterEligibleSchemes = (profile, schemes) => {
  const eligible = [];
  const ineligible = [];
  const unknown = [];
  const enrolled = [];

  const enrolledIds = new Set((profile.existing_coverage || []).map(String));

  for (const scheme of schemes) {
    if (enrolledIds.has(String(scheme._id))) {
       enrolled.push({ scheme, reasons: ['Already enrolled in this scheme.'] });
       continue;
    }

    const result = checkEligibility(profile, scheme.eligibility_criteria ?? {});
    
    if (result.status === 'eligible') {
      eligible.push({ scheme, reasons: result.reasons });
    } else if (result.status === 'ineligible') {
      ineligible.push({ scheme, reasons: result.reasons });
    } else {
      unknown.push({ scheme, reasons: result.reasons, missing_fields: result.missing_fields });
    }
  }

  return { eligible, ineligible, unknown, enrolled };
};

/**
 * Evaluate a profile against scheme criteria with explicit Rule ID tracking.
 *
 * @param {object} profile
 * @param {object} criteria
 * @returns {{ eligible: boolean, status: string, firedRuleIds: string[], triggeredRules: string[], reasons: string[], missing_fields: string[], rules: object[] }}
 */
export const evaluate = (profile, criteria = {}) => {
  // 1. Guard against malformed profile
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return {
      eligible: false,
      status: 'ineligible',
      firedRuleIds: [RULE_IDS.MALFORMED_FIELDS],
      triggeredRules: [RULE_IDS.MALFORMED_FIELDS],
      reasons: ['Profile must be a valid non-null object.'],
      missing_fields: [],
      rules: [{ rule_id: RULE_IDS.MALFORMED_FIELDS, status: 'FAIL', message: 'Profile is not a valid object' }]
    };
  }

  // 2. Format validation on profile fields
  if (profile.age !== undefined && profile.age !== null) {
    if (typeof profile.age !== 'number' || isNaN(profile.age) || profile.age < 0 || profile.age > 130) {
      return {
        eligible: false,
        status: 'ineligible',
        firedRuleIds: [RULE_IDS.MALFORMED_FIELDS],
        triggeredRules: [RULE_IDS.MALFORMED_FIELDS],
        reasons: [`Age must be a valid non-negative number between 0 and 130 (received: ${profile.age}).`],
        missing_fields: [],
        rules: [{ rule_id: RULE_IDS.MALFORMED_FIELDS, status: 'FAIL', message: `Invalid age: ${profile.age}` }]
      };
    }
  }

  if (profile.income_band !== undefined && profile.income_band !== null) {
    if (typeof profile.income_band !== 'string' || INCOME_BAND_ORDER[profile.income_band] === undefined) {
      return {
        eligible: false,
        status: 'unknown',
        firedRuleIds: [RULE_IDS.MALFORMED_FIELDS],
        triggeredRules: [RULE_IDS.MALFORMED_FIELDS],
        reasons: [`Profile has an unrecognised income_band: ${profile.income_band}.`],
        missing_fields: [],
        rules: [{ rule_id: RULE_IDS.MALFORMED_FIELDS, status: 'FAIL', message: `Unrecognised income_band: ${profile.income_band}` }]
      };
    }
  }

  // 3. Guard against empty criteria
  if (!criteria || Object.keys(criteria).length === 0) {
    return {
      eligible: false,
      status: 'unknown',
      firedRuleIds: [RULE_IDS.UNKNOWN_CRITERIA],
      triggeredRules: [RULE_IDS.UNKNOWN_CRITERIA],
      reasons: ['Criteria is empty or not defined.'],
      missing_fields: [],
      rules: [{ rule_id: RULE_IDS.UNKNOWN_CRITERIA, status: 'FAIL', message: 'Criteria is empty' }]
    };
  }

  const violations = [];
  const missing_fields = [];
  const passing_rules = [];
  const failing_rules = [];
  const ruleDetails = [];

  // Age Min
  if (criteria.age_min !== undefined) {
    if (profile.age === undefined || profile.age === null) {
      missing_fields.push('age');
      ruleDetails.push({ rule_id: RULE_IDS.AGE_MIN, status: 'MISSING', message: 'Age is missing' });
    } else if (profile.age < criteria.age_min) {
      violations.push(`Minimum age ${criteria.age_min} not met (profile age: ${profile.age}).`);
      failing_rules.push(RULE_IDS.AGE_MIN);
      ruleDetails.push({ rule_id: RULE_IDS.AGE_MIN, status: 'FAIL', message: `Age ${profile.age} < ${criteria.age_min}` });
    } else {
      passing_rules.push(RULE_IDS.AGE_MIN);
      ruleDetails.push({ rule_id: RULE_IDS.AGE_MIN, status: 'PASS', message: `Age ${profile.age} >= ${criteria.age_min}` });
    }
  }

  // Age Max
  if (criteria.age_max !== undefined) {
    if (profile.age === undefined || profile.age === null) {
      if (!missing_fields.includes('age')) missing_fields.push('age');
      ruleDetails.push({ rule_id: RULE_IDS.AGE_MAX, status: 'MISSING', message: 'Age is missing' });
    } else if (profile.age > criteria.age_max) {
      violations.push(`Maximum age ${criteria.age_max} exceeded (profile age: ${profile.age}).`);
      failing_rules.push(RULE_IDS.AGE_MAX);
      ruleDetails.push({ rule_id: RULE_IDS.AGE_MAX, status: 'FAIL', message: `Age ${profile.age} > ${criteria.age_max}` });
    } else {
      passing_rules.push(RULE_IDS.AGE_MAX);
      ruleDetails.push({ rule_id: RULE_IDS.AGE_MAX, status: 'PASS', message: `Age ${profile.age} <= ${criteria.age_max}` });
    }
  }

  // Income Max Band
  if (criteria.income_max_band && criteria.income_max_band !== 'any') {
    if (!profile.income_band) {
      missing_fields.push('income_band');
      ruleDetails.push({ rule_id: RULE_IDS.INCOME_BAND, status: 'MISSING', message: 'Income band is missing' });
    } else {
      const maxOrder = INCOME_BAND_ORDER[criteria.income_max_band];
      const userOrder = INCOME_BAND_ORDER[profile.income_band];
      if (maxOrder === undefined) {
        return {
          eligible: false,
          status: 'unknown',
          firedRuleIds: [RULE_IDS.UNKNOWN_CRITERIA],
          triggeredRules: [RULE_IDS.UNKNOWN_CRITERIA],
          reasons: [`Scheme has an invalid income_max_band: ${criteria.income_max_band}.`],
          missing_fields: [],
          rules: []
        };
      }
      if (userOrder > maxOrder) {
        violations.push(`Income band ${profile.income_band} exceeds maximum allowed ${criteria.income_max_band}.`);
        failing_rules.push(RULE_IDS.INCOME_BAND);
        ruleDetails.push({ rule_id: RULE_IDS.INCOME_BAND, status: 'FAIL', message: `Income band ${profile.income_band} > ${criteria.income_max_band}` });
      } else {
        passing_rules.push(RULE_IDS.INCOME_BAND);
        ruleDetails.push({ rule_id: RULE_IDS.INCOME_BAND, status: 'PASS', message: `Income band ${profile.income_band} <= ${criteria.income_max_band}` });
      }
    }
  }

  // Employment Type Check
  if (criteria.employment_types && criteria.employment_types.length > 0) {
    if (!profile.employment_type) {
      missing_fields.push('employment_type');
      ruleDetails.push({ rule_id: RULE_IDS.EMPLOYMENT_TYPE, status: 'MISSING', message: 'Employment type is missing' });
    } else if (!criteria.employment_types.includes(profile.employment_type)) {
      violations.push(`Employment type '${profile.employment_type}' not in allowed list: ${criteria.employment_types.join(', ')}.`);
      failing_rules.push(RULE_IDS.EMPLOYMENT_TYPE);
      ruleDetails.push({ rule_id: RULE_IDS.EMPLOYMENT_TYPE, status: 'FAIL', message: `Employment '${profile.employment_type}' not in ${criteria.employment_types}` });
    } else {
      passing_rules.push(RULE_IDS.EMPLOYMENT_TYPE);
      ruleDetails.push({ rule_id: RULE_IDS.EMPLOYMENT_TYPE, status: 'PASS', message: `Employment '${profile.employment_type}' eligible` });
    }
  }

  // Occupation Check
  if (criteria.occupation && criteria.occupation.length > 0) {
    if (!profile.occupation) {
      missing_fields.push('occupation');
      ruleDetails.push({ rule_id: RULE_IDS.OCCUPATION, status: 'MISSING', message: 'Occupation is missing' });
    } else {
      const match = criteria.occupation.some(o => o.toLowerCase() === profile.occupation.toLowerCase());
      if (!match) {
        violations.push(`Occupation '${profile.occupation}' not in allowed list: ${criteria.occupation.join(', ')}.`);
        failing_rules.push(RULE_IDS.OCCUPATION);
        ruleDetails.push({ rule_id: RULE_IDS.OCCUPATION, status: 'FAIL', message: 'Occupation not in allowed list' });
      } else {
        passing_rules.push(RULE_IDS.OCCUPATION);
        ruleDetails.push({ rule_id: RULE_IDS.OCCUPATION, status: 'PASS', message: 'Occupation eligible' });
      }
    }
  }

  // Bank Account Check (Custom Rule)
  if (criteria.custom_rules?.requires_bank_account === true) {
    if (profile.has_bank_account === undefined || profile.has_bank_account === null) {
      missing_fields.push('has_bank_account');
      ruleDetails.push({ rule_id: RULE_IDS.BANK_ACCOUNT, status: 'MISSING', message: 'Bank account status is missing' });
    } else if (profile.has_bank_account !== true) {
      violations.push('Requires an active bank account.');
      failing_rules.push(RULE_IDS.BANK_ACCOUNT);
      ruleDetails.push({ rule_id: RULE_IDS.BANK_ACCOUNT, status: 'FAIL', message: 'Requires an active bank account' });
    } else {
      passing_rules.push(RULE_IDS.BANK_ACCOUNT);
      ruleDetails.push({ rule_id: RULE_IDS.BANK_ACCOUNT, status: 'PASS', message: 'Has active bank account' });
    }
  }

  // Dependents Checks
  if (criteria.min_dependents !== undefined) {
    if (profile.dependents === undefined || profile.dependents === null) {
      missing_fields.push('dependents');
      ruleDetails.push({ rule_id: RULE_IDS.DEPENDENTS_MIN, status: 'MISSING', message: 'Dependents count missing' });
    } else if (profile.dependents < criteria.min_dependents) {
      violations.push(`Minimum dependents ${criteria.min_dependents} not met.`);
      failing_rules.push(RULE_IDS.DEPENDENTS_MIN);
      ruleDetails.push({ rule_id: RULE_IDS.DEPENDENTS_MIN, status: 'FAIL', message: `Dependents ${profile.dependents} < ${criteria.min_dependents}` });
    } else {
      passing_rules.push(RULE_IDS.DEPENDENTS_MIN);
      ruleDetails.push({ rule_id: RULE_IDS.DEPENDENTS_MIN, status: 'PASS', message: `Dependents >= ${criteria.min_dependents}` });
    }
  }

  if (criteria.max_dependents !== undefined) {
    if (profile.dependents === undefined || profile.dependents === null) {
      if (!missing_fields.includes('dependents')) missing_fields.push('dependents');
      ruleDetails.push({ rule_id: RULE_IDS.DEPENDENTS_MAX, status: 'MISSING', message: 'Dependents count missing' });
    } else if (profile.dependents > criteria.max_dependents) {
      violations.push(`Maximum dependents ${criteria.max_dependents} exceeded.`);
      failing_rules.push(RULE_IDS.DEPENDENTS_MAX);
      ruleDetails.push({ rule_id: RULE_IDS.DEPENDENTS_MAX, status: 'FAIL', message: `Dependents ${profile.dependents} > ${criteria.max_dependents}` });
    } else {
      passing_rules.push(RULE_IDS.DEPENDENTS_MAX);
      ruleDetails.push({ rule_id: RULE_IDS.DEPENDENTS_MAX, status: 'PASS', message: `Dependents <= ${criteria.max_dependents}` });
    }
  }

  // Priority 1: Violations -> ineligible
  if (violations.length > 0) {
    return {
      eligible: false,
      status: 'ineligible',
      firedRuleIds: failing_rules,
      triggeredRules: failing_rules,
      reasons: violations,
      missing_fields: [],
      rules: ruleDetails
    };
  }

  // Priority 2: Missing fields -> unknown
  if (missing_fields.length > 0) {
    return {
      eligible: false,
      status: 'unknown',
      firedRuleIds: [RULE_IDS.MISSING_FIELDS],
      triggeredRules: [RULE_IDS.MISSING_FIELDS],
      reasons: [`Missing profile fields required to determine eligibility: ${missing_fields.join(', ')}`],
      missing_fields,
      rules: ruleDetails
    };
  }

  // Priority 3: Custom rules or unrecognized criteria keys
  const unrecognisedKeys = Object.keys(criteria).filter(k => !KNOWN_CRITERIA_KEYS.has(k));
  const unknownReasons = [];
  if (criteria.custom_rules) {
    const unhandled = Object.keys(criteria.custom_rules).filter(k => k !== 'requires_bank_account');
    if (unhandled.length > 0) {
      unknownReasons.push(`Contains custom rules that require manual evaluation: ${unhandled.join(', ')}.`);
    }
  }
  if (unrecognisedKeys.length > 0) {
    unknownReasons.push(`Contains unrecognised criteria keys: ${unrecognisedKeys.join(', ')}.`);
  }

  if (unknownReasons.length > 0) {
    return {
      eligible: false,
      status: 'unknown',
      firedRuleIds: [RULE_IDS.UNKNOWN_CRITERIA],
      triggeredRules: [RULE_IDS.UNKNOWN_CRITERIA],
      reasons: unknownReasons,
      missing_fields: [],
      rules: ruleDetails
    };
  }

  // Priority 4: All evaluated criteria passed
  return {
    eligible: true,
    status: 'eligible',
    firedRuleIds: passing_rules,
    triggeredRules: passing_rules,
    reasons: ['Meets all evaluated criteria.'],
    missing_fields: [],
    rules: ruleDetails
  };
};

export const RuleEngine = {
  evaluate,
  checkEligibility,
  filterEligibleSchemes,
  RULE_IDS
};

