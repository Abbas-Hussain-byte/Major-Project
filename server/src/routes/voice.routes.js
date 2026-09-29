import express from 'express';
import { protect } from '../middleware/auth.js';
import { transcribe, translate, synthesize } from '../controllers/voice.controller.js';
import { upload } from '../middleware/uploadHandler.js';

const router = express.Router();

router.use(protect);
router.post('/transcribe', upload.single('audio'), transcribe);
router.post('/translate', translate);
router.post('/synthesize', synthesize);

export default router;
