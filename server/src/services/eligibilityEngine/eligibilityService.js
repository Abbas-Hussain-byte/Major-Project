/**
 * EligibilityService — orchestrates rule engine + LLM explanation.
 *
 * Decision flow:
 *   1. Load all active schemes from DB
 *   2. Run deterministic ruleEngine.filterEligibleSchemes()  ← YES/NO decision
 *   3. Compute gap list (eligible but not enrolled)
 *   4. Call Gemini ONLY to produce plain-language explanation of already-decided results
 *   5. Persist EligibilityMatch records for new matches
 */
import Scheme from '../../models/Scheme.js';
import Profile from '../../models/Profile.js';
import EligibilityMatch from '../../models/EligibilityMatch.js';
import { filterEligibleSchemes } from './ruleEngine.js';
import { geminiChat } from '../llm/geminiService.js';

const EXPLANATION_PROMPT = `You are a plain-language assistant helping unorganised-sector
workers in India understand government schemes and insurance benefits.
Given a list of schemes a user qualifies for, write a brief, simple explanation
(2-3 sentences per scheme) of the benefit, cost, and how to apply.
Do not make any eligibility decisions — those have already been made.
Do not add information not present in the scheme data provided.
Output as JSON array: [{scheme_id, name, explanation}]`;

/**
 * Run eligibility check for a user and return gap list with explanations.
 * @param {string} userId
 * @returns {Promise<{gaps: object[], explanation: string}>}
 */
export const runEligibilityCheck = async (userId) => {
  const profile = await Profile.findOne({ user_id: userId }).lean();
  if (!profile) throw new Error('Profile not found — complete your profile first');

  const schemes = await Scheme.find({ is_active: true }).lean();
  const { eligible } = filterEligibleSchemes(profile, schemes);

  // Compute gap = eligible but not already enrolled
  const enrolledIds = new Set((profile.existing_coverage || []).map(String));
  const gaps = eligible
    .map((e) => e.scheme)
    .filter((s) => !enrolledIds.has(String(s._id)));

  // Persist new matches (upsert to avoid duplicates)
  for (const scheme of gaps) {
    await EligibilityMatch.findOneAndUpdate(
      { user_id: userId, scheme_id: scheme._id },
      { $setOnInsert: { matched_at: new Date(), status: 'notified' } },
      { upsert: true, new: false }
    );
  }

  // LLM explains results — never decides them
  let explanations = [];
  if (gaps.length > 0) {
    const schemeData = gaps.map((s) => ({
      scheme_id: s._id,
      name: s.name,
      benefit: s.benefit_description,
      premium_annual_inr: s.premium_annual_inr,
      coverage_inr: s.coverage_inr,
      how_to_apply: s.how_to_apply,
    }));

    try {
      const raw = await geminiChat(
        EXPLANATION_PROMPT,
        JSON.stringify(schemeData)
      );
      explanations = JSON.parse(raw);
    } catch {
      // LLM failure must not break eligibility results
      explanations = gaps.map((s) => ({
        scheme_id: s._id,
        name: s.name,
        explanation: s.benefit_description,
      }));
    }
  }

  return { gaps, explanations };
};
