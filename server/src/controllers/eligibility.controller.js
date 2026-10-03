import { runEligibilityCheck } from '../services/eligibilityEngine/eligibilityService.js';
import EligibilityMatch from '../models/EligibilityMatch.js';
import Scheme from '../models/Scheme.js';
import { RuleEngine } from '../services/eligibilityEngine/ruleEngine.js';

export const queryEligibility = async (req, res) => {
  const result = await runEligibilityCheck(req.user._id);
  res.json(result);
};

export const getGaps = async (req, res) => {
  const result = await runEligibilityCheck(req.user._id);
  res.json({ gaps: result.gaps, explanations: result.explanations });
};

export const updateMatchStatus = async (req, res) => {
  const { matchId } = req.params;
  const { status } = req.body;

  const allowed = ['notified', 'enrolled', 'dismissed'];
  if (!allowed.includes(status))
    return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });

  const match = await EligibilityMatch.findOneAndUpdate(
    { _id: matchId, user_id: req.user._id },
    { status },
    { new: true }
  );
  if (!match) return res.status(404).json({ message: 'Match not found' });
  res.json(match);
};

/**
 * Direct eligibility evaluation endpoint for a profile against criteria or active schemes.
 * POST /api/eligibility/check
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const checkEligibilityEndpoint = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: request body is required'
      });
    }

    // Extract profile (from body.profile or body directly)
    let profile = body.profile !== undefined ? body.profile : body;

    // Reject non-object or null or array profile
    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: profile must be a valid JSON object'
      });
    }

    // Input validation on profile attributes
    if (profile.age !== undefined && (typeof profile.age !== 'number' || isNaN(profile.age) || profile.age < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: age must be a non-negative number'
      });
    }

    if (profile.income_band !== undefined && typeof profile.income_band !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: income_band must be a string'
      });
    }

    if (profile.has_bank_account !== undefined && typeof profile.has_bank_account !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: has_bank_account must be a boolean'
      });
    }

    // 1. Direct criteria check
    if (body.criteria && typeof body.criteria === 'object') {
      const evalResult = RuleEngine.evaluate(profile, body.criteria);
      return res.status(200).json({
        success: true,
        eligible: evalResult.eligible,
        status: evalResult.status,
        firedRuleIds: evalResult.firedRuleIds,
        triggeredRules: evalResult.triggeredRules,
        reasons: evalResult.reasons,
        missing_fields: evalResult.missing_fields,
        rules: evalResult.rules
      });
    }

    // 2. Specific scheme check
    if (body.scheme_id) {
      const scheme = await Scheme.findOne({
        $or: [{ _id: body.scheme_id }, { name: body.scheme_id }]
      }).lean();

      if (!scheme) {
        return res.status(404).json({
          success: false,
          error: `Scheme not found: ${body.scheme_id}`
        });
      }

      const evalResult = RuleEngine.evaluate(profile, scheme.eligibility_criteria || {});
      return res.status(200).json({
        success: true,
        scheme: scheme.name,
        scheme_id: scheme._id,
        eligible: evalResult.eligible,
        status: evalResult.status,
        firedRuleIds: evalResult.firedRuleIds,
        triggeredRules: evalResult.triggeredRules,
        reasons: evalResult.reasons,
        missing_fields: evalResult.missing_fields,
        rules: evalResult.rules
      });
    }

    // 3. Multi-scheme check against all active schemes
    const schemes = await Scheme.find({ is_active: true }).lean();
    const evaluatedSchemes = schemes.map(scheme => {
      const evalResult = RuleEngine.evaluate(profile, scheme.eligibility_criteria || {});
      return {
        scheme_id: scheme._id,
        name: scheme.name,
        type: scheme.type,
        benefit_description: scheme.benefit_description,
        premium_annual_inr: scheme.premium_annual_inr,
        coverage_inr: scheme.coverage_inr,
        eligible: evalResult.eligible,
        status: evalResult.status,
        firedRuleIds: evalResult.firedRuleIds,
        triggeredRules: evalResult.triggeredRules,
        reasons: evalResult.reasons
      };
    });

    const eligibleMatches = evaluatedSchemes.filter(s => s.eligible);

    return res.status(200).json({
      success: true,
      eligible: eligibleMatches.length > 0,
      eligibleCount: eligibleMatches.length,
      totalEvaluated: schemes.length,
      schemes: evaluatedSchemes,
      matches: eligibleMatches
    });

  } catch (err) {
    console.error('[EligibilityController] checkEligibilityEndpoint failure:', err);
    return res.status(500).json({
      success: false,
      error: 'Service failure during eligibility check',
      message: err.message
    });
  }
};
