import express from 'express';
import { protect } from '../middleware/auth.js';
import { queryEligibility, getGaps, updateMatchStatus } from '../controllers/eligibility.controller.js';

const router = express.Router();

router.use(protect);
router.post('/query', queryEligibility);
router.get('/gaps', getGaps);
router.patch('/matches/:matchId', updateMatchStatus);

export default router;
