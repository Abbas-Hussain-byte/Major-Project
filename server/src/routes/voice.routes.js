import express from 'express';
import * as voiceController from '../controllers/voiceGateway.controller.js';

const router = express.Router();

router.get('/capabilities', voiceController.getCapabilities);
router.post('/translate', voiceController.translate);
router.post('/query', voiceController.query);
router.post('/transcribe', voiceController.transcribe);
router.post('/synthesize', voiceController.synthesize);

export default router;
