import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

let cachedDemoUser = null;
export const getOrCreateDemoUser = async () => {
  if (cachedDemoUser) return cachedDemoUser;
  let user = await User.findOne({ phone_number: '9876543210' });
  if (!user) {
    user = await User.create({
      name: 'Ramesh Kumar (Demo)',
      phone_number: '9876543210',
      password: 'DemoPassword123!',
      preferred_language: 'te',
    });
  }
  let profile = await Profile.findOne({ user_id: user._id });
  if (!profile) {
    profile = await Profile.create({
      user_id: user._id,
      age: 32,
      income_band: '1L_3L',
      occupation: 'Construction Worker',
      employment_type: 'daily_wage',
      dependents: 2,
      has_bank_account: true,
      existing_coverage: [],
    });
  } else if (profile.has_bank_account === undefined) {
    profile.has_bank_account = true;
    profile.income_band = '1L_3L';
    profile.employment_type = 'daily_wage';
    await profile.save();
  }
  cachedDemoUser = user;
  return user;
};

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token && token !== 'null' && token !== 'undefined') {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) return next();
    } catch {
      // Fall through to demo user fallback
    }
  }

  // Graceful fallback for hackathon demonstration & instant testability
  try {
    req.user = await getOrCreateDemoUser();
    return next();
  } catch (err) {
    console.error('[AuthMiddleware] Demo user creation failed:', err.message);
    return res.status(401).json({ message: 'Authentication required' });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
