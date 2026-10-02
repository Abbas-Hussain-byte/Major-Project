import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { answerQuestion } from '../services/literacyTutor/literacyService.js';
import { translateToEnglish, translateFromEnglish } from '../services/voiceGateway/bhashiniService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getLiteracyChunks = async (req, res) => {
  try {
    const { category, topic, search } = req.query;
    const dataPath = path.resolve(__dirname, '../data/financialLiteracyData.json');
    let chunks = [];
    if (fs.existsSync(dataPath)) {
      chunks = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    if (category && category !== 'all') {
      chunks = chunks.filter(c => c.category === category);
    }
    if (topic) {
      chunks = chunks.filter(c => c.topic === topic);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      chunks = chunks.filter(c => {
        const enTitle = c.en?.title?.toLowerCase() || '';
        const enContent = c.en?.content_text?.toLowerCase() || '';
        const hiTitle = c.hi?.title?.toLowerCase() || '';
        const teTitle = c.te?.title?.toLowerCase() || '';
        return enTitle.includes(q) || enContent.includes(q) || hiTitle.includes(q) || teTitle.includes(q);
      });
    }

    res.json({
      success: true,
      total: chunks.length,
      chunks
    });
  } catch (err) {
    console.error('[LiteracyController] getLiteracyChunks error:', err);
    res.status(500).json({ error: 'Failed to retrieve literacy chunks' });
  }
};

export const getLiteracyChunkById = async (req, res) => {
  try {
    const { id } = req.params;
    const dataPath = path.resolve(__dirname, '../data/financialLiteracyData.json');
    let chunks = [];
    if (fs.existsSync(dataPath)) {
      chunks = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    const chunk = chunks.find(c => c.id === id);
    if (!chunk) {
      return res.status(404).json({ error: 'Literacy chunk not found' });
    }
    res.json(chunk);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving chunk' });
  }
};

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
