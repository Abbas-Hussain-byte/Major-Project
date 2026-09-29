import express from 'express';
import { protect } from '../middleware/auth.js';
import { askQuestion } from '../controllers/literacy.controller.js';

const router = express.Router();

router.use(protect);
router.post('/ask', askQuestion);

export default router;
