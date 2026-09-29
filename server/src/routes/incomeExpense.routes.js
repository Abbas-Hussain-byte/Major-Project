import express from 'express';
import { protect } from '../middleware/auth.js';
import { createLog, getSummary } from '../controllers/incomeExpense.controller.js';

const router = express.Router();

router.use(protect);
router.post('/', createLog);
router.get('/summary', getSummary);

export default router;
