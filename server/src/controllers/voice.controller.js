import fs from 'fs';
import { transcribeAudio } from '../services/voiceGateway/providers/sarvamService.js';
import {
  translateText,
  synthesizeSpeech,
} from '../services/voiceGateway/bhashiniService.js';

export const transcribe = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Audio file required' });
  const lang = req.body.language || req.user?.preferred_language || 'hi';

  const buffer = fs.readFileSync(req.file.path);
  const result = await transcribeAudio(buffer, lang);

  // Clean up temp file
  fs.unlinkSync(req.file.path);

  res.json(result);
};

export const translate = async (req, res) => {
  const { text, source_language, target_language } = req.body;
  if (!text || !source_language || !target_language)
    return res.status(400).json({ message: 'text, source_language and target_language required' });

  const translated = await translateText(text, source_language, target_language);
  res.json({ translated, source_language, target_language });
};

export const synthesize = async (req, res) => {
  const { text, language } = req.body;
  if (!text) return res.status(400).json({ message: 'text required' });

  const lang = language || req.user?.preferred_language || 'hi';
  const result = await synthesizeSpeech(text, lang);
  res.json(result);
};
