import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user_id: req.user._id }).lean();
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
};

export const updateProfile = async (req, res) => {
  const allowed = ['age', 'income_band', 'occupation', 'employment_type', 'dependents', 'has_bank_account', 'existing_coverage'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const profile = await Profile.findOneAndUpdate(
    { user_id: req.user._id },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
};
