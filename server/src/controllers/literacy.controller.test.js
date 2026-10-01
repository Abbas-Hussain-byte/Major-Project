import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { askQuestion } from './literacy.controller.js';
import * as literacyService from '../services/literacyTutor/literacyService.js';
import * as bhashiniService from '../services/voiceGateway/bhashiniService.js';

vi.mock('../services/literacyTutor/literacyService.js');
vi.mock('../services/voiceGateway/bhashiniService.js');

describe('literacy.controller', () => {
  let req, res;
  beforeEach(() => {
    req = { body: { question: 'test', language: 'en' }, user: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  it('returns 503 for llm_unavailable', async () => {
    literacyService.answerQuestion.mockResolvedValue({ status: 'llm_unavailable', text: null, sources: [] });
    await askQuestion(req, res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ status: 'llm_unavailable', message: expect.any(String) });
  });

  it('returns 200 for not_grounded', async () => {
    literacyService.answerQuestion.mockResolvedValue({ status: 'not_grounded', text: null, sources: [] });
    await askQuestion(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'not_grounded', answer: expect.any(String), sources: [], original_language: 'en' });
  });

  it('returns 200 for grounded', async () => {
    literacyService.answerQuestion.mockResolvedValue({ status: 'grounded', text: 'answer', sources: [{id: 1}] });
    await askQuestion(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'grounded', answer: 'answer', sources: [{id: 1}], original_language: 'en' });
  });
});
