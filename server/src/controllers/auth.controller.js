import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { ENV } from '../config/env.js';

const signToken = (id) =>
  jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });

export const register = async (req, res) => {
  const { name, phone_number, password, preferred_language } = req.body;
  if (!name || !phone_number || !password) {
    return res.status(400).json({ message: 'name, phone_number and password are required' });
  }

  const existing = await User.findOne({ phone_number });
  if (existing) return res.status(409).json({ message: 'Phone number already registered' });

  const user = await User.create({ name, phone_number, password, preferred_language });
  await Profile.create({ user_id: user._id });

  const token = signToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name, phone_number, preferred_language } });
};

export const login = async (req, res) => {
  const { phone_number, password } = req.body;
  if (!phone_number || !password)
    return res.status(400).json({ message: 'phone_number and password are required' });

  const user = await User.findOne({ phone_number }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, phone_number, preferred_language: user.preferred_language } });
};
