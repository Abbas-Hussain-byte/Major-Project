import Scheme from '../models/Scheme.js';
import LiteracyContent from '../models/LiteracyContent.js';
import KnowledgeSource from '../models/KnowledgeSource.js';

export const getAllSchemes = async (filter = {}) => {
  return await Scheme.find(filter).lean();
};

export const createNewScheme = async (data) => {
  return await Scheme.create(data);
};

export const getAllLiteracyContent = async (filter = {}) => {
  return await LiteracyContent.find(filter).populate('source_id').lean();
};

export const createNewLiteracyContent = async (data) => {
  const sourceExists = await KnowledgeSource.findById(data.source_id);
  if (!sourceExists) {
    throw new Error('Knowledge source not found');
  }
  return await LiteracyContent.create(data);
};
