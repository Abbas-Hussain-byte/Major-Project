import { answerQuestion } from '../services/literacyTutor/literacyService.js';
import { translateToEnglish, translateFromEnglish } from '../services/voiceGateway/bhashiniService.js';

export const askQuestion = async (req, res) => {
  const { question, language } = req.body;
  if (!question) return res.status(400).json({ message: 'question is required' });

  const userLang = language || req.user.preferred_language || 'hi';

  // Translation sandwich: native → EN → answer → native
  const englishQuestion = userLang !== 'en'
    ? await translateToEnglish(question, userLang)
    : question;

  const { answer, sources } = await answerQuestion(englishQuestion);

  const nativeAnswer = userLang !== 'en'
    ? await translateFromEnglish(answer, userLang)
    : answer;

  res.json({ answer: nativeAnswer, sources, original_language: userLang });
};
