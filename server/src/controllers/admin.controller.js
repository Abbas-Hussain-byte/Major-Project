import {
  getAllSchemes,
  createNewScheme,
  getAllLiteracyContent,
  createNewLiteracyContent,
} from '../services/adminService.js';

export const listSchemes = async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  const schemes = await getAllSchemes(filter);
  res.json(schemes);
};

export const createScheme = async (req, res) => {
  const { name, type, eligibility_criteria, benefit_description, source_document_ref } = req.body;
  if (!name || !type || !benefit_description || !source_document_ref) {
    return res.status(400).json({ message: 'Missing required scheme fields' });
  }

  const scheme = await createNewScheme(req.body);
  res.status(201).json(scheme);
};

export const listLiteracyContent = async (req, res) => {
  const { topic } = req.query;
  const filter = topic ? { topic } : {};
  const content = await getAllLiteracyContent(filter);
  res.json(content);
};

export const createLiteracyContent = async (req, res) => {
  const { source_id, title, topic, content_text } = req.body;
  if (!source_id || !title || !topic || !content_text) {
    return res.status(400).json({ message: 'Missing required literacy content fields' });
  }

  try {
    const content = await createNewLiteracyContent(req.body);
    res.status(201).json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
