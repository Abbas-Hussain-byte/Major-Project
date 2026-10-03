import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  queryEligibility,
  getGaps,
  updateMatchStatus,
  checkEligibilityEndpoint
} from '../controllers/eligibility.controller.js';

const router = express.Router();

// Direct evaluation endpoint (callable for profile checks, pre-auth, or automated auditing)
router.post('/check', checkEligibilityEndpoint);

// Protected user-scoped endpoints
router.use(protect);
router.post('/query', queryEligibility);
router.get('/gaps', getGaps);
router.patch('/matches/:matchId', updateMatchStatus);

export default router;
