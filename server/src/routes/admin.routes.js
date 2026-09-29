import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  listSchemes, createScheme,
  listLiteracyContent, createLiteracyContent,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/schemes', listSchemes);
router.post('/schemes', createScheme);
router.get('/literacy-content', listLiteracyContent);
router.post('/literacy-content', createLiteracyContent);

export default router;
