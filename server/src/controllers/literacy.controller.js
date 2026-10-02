import { answerQuestion } from '../services/literacyTutor/literacyService.js';
import { translateToEnglish, translateFromEnglish } from '../services/voiceGateway/bhashiniService.js';

export const askQuestion = async (req, res) => {
  const { question, language, lang } = req.body;
  if (!question) return res.status(400).json({ message: 'question is required' });

  const userLang = language || lang || req.user?.preferred_language || 'en';

  // Translation sandwich: native → EN → answer → native
  const englishQuestion = userLang !== 'en'
    ? await translateToEnglish(question, userLang)
    : question;

  const result = await answerQuestion(englishQuestion);

  if (result.status === 'llm_unavailable') {
    return res.status(503).json({
      status: 'llm_unavailable',
      message: 'Service temporarily unavailable',
    });
  }

  let nativeAnswer = result.text;
  if (result.text && userLang !== 'en') {
    nativeAnswer = await translateFromEnglish(result.text, userLang);
  } else if (!result.text) {
    nativeAnswer = "I don't have reliable information on that topic.";
    if (userLang !== 'en') {
      nativeAnswer = await translateFromEnglish(nativeAnswer, userLang);
    }
  }

  res.status(200).json({
    status: result.status,
    answer: nativeAnswer,
    sources: result.sources,
    original_language: userLang,
  });
};
