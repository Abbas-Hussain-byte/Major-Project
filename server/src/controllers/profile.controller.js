import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user_id: req.user._id }).lean();
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
};

export const updateProfile = async (req, res) => {
  try {
    const validIncomeBands = ['below_1L', '1L_3L', '3L_5L', 'above_5L'];
    const validEmploymentTypes = ['gig_worker', 'street_vendor', 'daily_wage', 'other_unorganised'];

    const updates = {};

    if (req.body.age !== undefined && req.body.age !== '') {
      const parsedAge = parseInt(req.body.age, 10);
      if (!isNaN(parsedAge) && parsedAge >= 0 && parsedAge <= 120) {
        updates.age = parsedAge;
      }
    }

    if (req.body.occupation !== undefined && typeof req.body.occupation === 'string') {
      updates.occupation = req.body.occupation.trim();
    }

    if (req.body.income_band !== undefined && req.body.income_band !== '') {
      if (validIncomeBands.includes(req.body.income_band)) {
        updates.income_band = req.body.income_band;
      }
    }

    if (req.body.employment_type !== undefined && req.body.employment_type !== '') {
      if (validEmploymentTypes.includes(req.body.employment_type)) {
        updates.employment_type = req.body.employment_type;
      }
    }

    if (req.body.dependents !== undefined && req.body.dependents !== '') {
      const parsedDep = parseInt(req.body.dependents, 10);
      if (!isNaN(parsedDep) && parsedDep >= 0) {
        updates.dependents = parsedDep;
      }
    }

    if (req.body.has_bank_account !== undefined) {
      updates.has_bank_account = req.body.has_bank_account === true || req.body.has_bank_account === 'true';
    }

    if (Array.isArray(req.body.existing_coverage)) {
      updates.existing_coverage = req.body.existing_coverage;
    }

    const profile = await Profile.findOneAndUpdate(
      { user_id: req.user._id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('[ProfileController] Update error:', err);
    res.status(400).json({ message: err.message || 'Failed to update profile' });
  }
};
