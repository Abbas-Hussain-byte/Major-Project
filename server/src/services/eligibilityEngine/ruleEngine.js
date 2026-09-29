/**
 * Rule Engine — deterministic eligibility checks.
 *
 * CRITICAL: This module makes all yes/no eligibility decisions.
 * The LLM must NEVER be called here or used to override these results.
 * LLM involvement is limited to downstream explanation of already-decided results.
 */

/**
 * Income band ordering for comparison.
 * The profile stores an income_band (e.g., '1L_3L') and the criteria stores an income_max_band.
 * We map each to a numeric order. If the user's order > max order, they are ineligible.
 */
const INCOME_BAND_ORDER = {
  below_1L: 0,
  '1L_3L': 1,
  '3L_5L': 2,
  above_5L: 3,
};

/**
 * Check whether a user profile satisfies a single scheme's eligibility criteria.
 *
 * @param {object} profile  - Mongoose Profile document (lean)
 * @param {object} criteria - scheme.eligibility_criteria (lean)
 * @returns {{ status: 'eligible'|'ineligible'|'unknown', reasons: string[], missing_fields?: string[] }}
 */
export const checkEligibility = (profile, criteria) => {
  const reasons = [];
  const missing_fields = [];
  
  if (!criteria || Object.keys(criteria).length === 0) {
    return { status: 'unknown', reasons: ['Criteria is empty or not defined.'], missing_fields: [] };
  }

  // --- Age checks ---
  if (criteria.age_min !== undefined) {
    if (profile.age === undefined || profile.age === null) {
      missing_fields.push('age');
    } else if (profile.age < criteria.age_min) {
      reasons.push(`Minimum age ${criteria.age_min} not met (profile age: ${profile.age}).`);
    } else {
      reasons.push(`Meets minimum age of ${criteria.age_min}.`);
    }
  }
  if (criteria.age_max !== undefined) {
    if (profile.age === undefined || profile.age === null) {
      if (!missing_fields.includes('age')) missing_fields.push('age');
    } else if (profile.age > criteria.age_max) {
      reasons.push(`Maximum age ${criteria.age_max} exceeded (profile age: ${profile.age}).`);
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
        reasons.push(`Scheme has an invalid income_max_band: ${criteria.income_max_band}.`);
      } else if (userOrder > maxOrder) {
        reasons.push(`Income band ${profile.income_band} exceeds maximum allowed ${criteria.income_max_band}.`);
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
        reasons.push(`Occupation '${profile.occupation}' not in allowed list: ${criteria.occupation.join(', ')}.`);
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
      reasons.push(`Employment type '${profile.employment_type}' not in allowed list: ${criteria.employment_types.join(', ')}.`);
    } else {
      reasons.push(`Employment type '${profile.employment_type}' is eligible.`);
    }
  }

  // --- Dependents checks ---
  if (criteria.min_dependents !== undefined) {
    if (profile.dependents === undefined || profile.dependents === null) {
      missing_fields.push('dependents');
    } else if (profile.dependents < criteria.min_dependents) {
      reasons.push(`Minimum dependents ${criteria.min_dependents} not met.`);
    } else {
      reasons.push(`Meets minimum dependents requirement.`);
    }
  }
  if (criteria.max_dependents !== undefined) {
    if (profile.dependents === undefined || profile.dependents === null) {
      if (!missing_fields.includes('dependents')) missing_fields.push('dependents');
    } else if (profile.dependents > criteria.max_dependents) {
      reasons.push(`Maximum dependents ${criteria.max_dependents} exceeded.`);
    } else {
      reasons.push(`Meets maximum dependents limit.`);
    }
  }

  if (missing_fields.length > 0) {
    return { status: 'unknown', reasons: [`Missing profile fields required to determine eligibility: ${missing_fields.join(', ')}`], missing_fields };
  }

  // If there's any rejection reason containing words indicating failure (hacky for this refactor without massive restructure, but we just check if it 'exceeds', 'not met', 'not in', 'exceeded')
  const isRejected = reasons.some(r => r.includes('not met') || r.includes('exceeded') || r.includes('exceeds') || r.includes('not in') || r.includes('invalid'));

  if (isRejected) {
    return { status: 'ineligible', reasons, missing_fields: [] };
  }

  if (reasons.length === 0) {
      // If we got here and there are no reasons, it means there were criteria but none of them triggered any logic (e.g. unknown criteria properties or only custom_rules)
      // Custom rules we treat as 'unknown' for now since we don't have code to evaluate them.
      if (criteria.custom_rules && Object.keys(criteria.custom_rules).length > 0) {
        return { status: 'unknown', reasons: ['Contains custom rules that require manual evaluation or missing profile data (e.g. bank account).'], missing_fields: [] };
      }
      return { status: 'eligible', reasons: ['Meets all evaluated criteria.'], missing_fields: [] };
  }

  return { status: 'eligible', reasons, missing_fields: [] };
};

/**
 * Filter a list of schemes to those that are eligible for a given profile.
 *
 * @param {object} profile
 * @param {object[]} schemes  - array of Mongoose Scheme documents (lean)
 * @returns {{ eligible: object[], ineligible: object[], unknown: object[] }}
 */
export const filterEligibleSchemes = (profile, schemes) => {
  const eligible = [];
  const ineligible = [];
  const unknown = [];

  for (const scheme of schemes) {
    const result = checkEligibility(profile, scheme.eligibility_criteria ?? {});
    
    // Check existing coverage
    const enrolledIds = new Set((profile.existing_coverage || []).map(String));
    if (enrolledIds.has(String(scheme._id))) {
       ineligible.push({ scheme, reasons: [...result.reasons, 'Already enrolled in this scheme.'] });
       continue;
    }

    if (result.status === 'eligible') {
      eligible.push({ scheme, reasons: result.reasons });
    } else if (result.status === 'ineligible') {
      ineligible.push({ scheme, reasons: result.reasons });
    } else {
      unknown.push({ scheme, reasons: result.reasons, missing_fields: result.missing_fields });
    }
  }

  return { eligible, ineligible, unknown };
};
