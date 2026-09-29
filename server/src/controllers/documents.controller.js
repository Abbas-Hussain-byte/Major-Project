import path from 'path';
import DocumentModel from '../models/Document.js';
import { processDocument } from '../services/documentExplainer/documentService.js';

export const uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Document file required' });

  const { document_type } = req.body;
  const validTypes = ['insurance_policy', 'government_scheme', 'KYC', 'loan_agreement', 'card_tnc'];
  if (!validTypes.includes(document_type))
    return res.status(400).json({ message: `document_type must be one of: ${validTypes.join(', ')}` });

  // Save document record first
  const doc = await DocumentModel.create({
    user_id: req.user._id,
    document_type,
    original_filename: req.file.originalname,
    file_path: req.file.path,
    mime_type: req.file.mimetype,
  });

  // Process asynchronously but await for now (move to queue in production)
  const processed = await processDocument(String(doc._id), String(req.user._id));

  // Never expose raw file path to client
  const response = processed.toObject();
  delete response.file_path;

  res.status(201).json(response);
};

export const getDocument = async (req, res) => {
  const doc = await DocumentModel.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  }).lean();

  if (!doc) return res.status(404).json({ message: 'Document not found' });

  // Strip file path before returning
  delete doc.file_path;
  res.json(doc);
};
