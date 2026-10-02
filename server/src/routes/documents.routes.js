import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/uploadHandler.js';
import { uploadDocument, getDocument, askDocumentQuestion } from '../controllers/documents.controller.js';

const router = express.Router();

router.use(protect);
router.post('/upload', upload.single('document'), uploadDocument);
router.post('/ask', askDocumentQuestion);
router.post('/:id/ask', askDocumentQuestion);
router.get('/:id', getDocument);

export default router;
