/**
 * Rule Engine — deterministic eligibility checks.
 *
 * CRITICAL: This module makes all yes/no eligibility decisions.
 * The LLM must NEVER be called here or used to override these results.
 * LLM involvement is limited to downstream explanation of already-decided results.
 */

/**
 * Income band ordering for comparison.
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
 * @returns {{ eligible: boolean, reasons: string[] }}
 */
export const checkEligibility = (profile, criteria) => {
  const reasons = [];

  // --- Age checks ---
  if (criteria.age_min !== undefined && profile.age < criteria.age_min) {
    reasons.push(`Minimum age ${criteria.age_min} not met (profile age: ${profile.age})`);
  }
  if (criteria.age_max !== undefined && profile.age > criteria.age_max) {
    reasons.push(`Maximum age ${criteria.age_max} exceeded (profile age: ${profile.age})`);
  }

  // --- Income band check ---
  if (criteria.income_max_band && criteria.income_max_band !== 'any') {
    const maxOrder = INCOME_BAND_ORDER[criteria.income_max_band] ?? 99;
    const userOrder = INCOME_BAND_ORDER[profile.income_band] ?? 99;
    if (userOrder > maxOrder) {
      reasons.push(
        `Income band ${profile.income_band} exceeds maximum allowed ${criteria.income_max_band}`
      );
    }
  }

  // --- Occupation check ---
  if (criteria.occupation?.length > 0 && profile.occupation) {
    const match = criteria.occupation.some(
      (o) => o.toLowerCase() === profile.occupation?.toLowerCase()
    );
    if (!match) {
      reasons.push(
        `Occupation '${profile.occupation}' not in allowed list: ${criteria.occupation.join(', ')}`
      );
    }
  }

  // --- Employment type check ---
  if (criteria.employment_types?.length > 0) {
    if (!criteria.employment_types.includes(profile.employment_type)) {
      reasons.push(
        `Employment type '${profile.employment_type}' not in allowed list: ${criteria.employment_types.join(', ')}`
      );
    }
  }

  // --- Dependents checks ---
  if (criteria.min_dependents !== undefined && profile.dependents < criteria.min_dependents) {
    reasons.push(`Minimum dependents ${criteria.min_dependents} not met`);
  }
  if (criteria.max_dependents !== undefined && profile.dependents > criteria.max_dependents) {
    reasons.push(`Maximum dependents ${criteria.max_dependents} exceeded`);
  }

  return { eligible: reasons.length === 0, reasons };
};

/**
 * Filter a list of schemes to those that are eligible for a given profile.
 *
 * @param {object} profile
 * @param {object[]} schemes  - array of Mongoose Scheme documents (lean)
 * @returns {{ eligible: object[], ineligible: object[] }}
 */
export const filterEligibleSchemes = (profile, schemes) => {
  const eligible = [];
  const ineligible = [];

  for (const scheme of schemes) {
    const result = checkEligibility(profile, scheme.eligibility_criteria ?? {});
    if (result.eligible) {
      eligible.push({ scheme, reasons: [] });
    } else {
      ineligible.push({ scheme, reasons: result.reasons });
    }
  }

  return { eligible, ineligible };
};
