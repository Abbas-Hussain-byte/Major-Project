import express from 'express';
import * as voiceGatewayController from '../controllers/voiceGateway.controller.js';
import * as voiceController from '../controllers/voice.controller.js';
import { upload } from '../middleware/uploadHandler.js';

const router = express.Router();

router.get('/capabilities', voiceGatewayController.getCapabilities);
router.post('/translate', voiceGatewayController.translate);
router.post('/query', voiceGatewayController.query);
router.post('/transcribe', upload.single('audio'), voiceController.transcribe);
router.post('/synthesize', voiceGatewayController.synthesize);

export default router;
