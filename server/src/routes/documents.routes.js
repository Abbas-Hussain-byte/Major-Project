import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/uploadHandler.js';
import { uploadDocument, getDocument, askDocumentQuestion, deleteDocument } from '../controllers/documents.controller.js';

const router = express.Router();

router.use(protect);
router.post('/upload', upload.single('document'), uploadDocument);
router.post('/ask', askDocumentQuestion);
router.post('/:id/ask', askDocumentQuestion);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;

