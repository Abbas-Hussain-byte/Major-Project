import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/uploadHandler.js';
import { uploadDocument, getDocument } from '../controllers/documents.controller.js';

const router = express.Router();

router.use(protect);
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/:id', getDocument);

export default router;
