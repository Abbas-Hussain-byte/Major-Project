import express from 'express';
import { 
  askQuestion, 
  getLiteracyChunks, 
  getLiteracyChunkById 
} from '../controllers/literacy.controller.js';

const router = express.Router();

router.get('/chunks', getLiteracyChunks);
router.get('/chunks/:id', getLiteracyChunkById);
router.get('/modules', getLiteracyChunks);
router.post('/ask', askQuestion);

export default router;
