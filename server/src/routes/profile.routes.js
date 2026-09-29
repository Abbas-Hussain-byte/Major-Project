import express from 'express';
import { protect } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
