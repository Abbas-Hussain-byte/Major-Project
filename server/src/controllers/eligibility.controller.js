import { runEligibilityCheck } from '../services/eligibilityEngine/eligibilityService.js';
import EligibilityMatch from '../models/EligibilityMatch.js';

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
