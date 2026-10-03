import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Scheme from '../models/Scheme.js';
import { RuleEngine } from '../services/eligibilityEngine/ruleEngine.js';

describe('POST /api/eligibility/check - Supertest Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // 200 OK — Successful Evaluation Tests
  // ==========================================
  describe('200 Success Cases', () => {
    it('returns 200 with eligible: true when profile satisfies direct criteria', async () => {
      const payload = {
        profile: {
          age: 30,
          income_band: '1L_3L',
          has_bank_account: true,
          employment_type: 'daily_wage'
        },
        criteria: {
          age_min: 18,
          age_max: 50,
          income_max_band: '1L_3L',
          custom_rules: { requires_bank_account: true }
        }
      };

      const res = await request(app)
        .post('/api/eligibility/check')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.eligible).toBe(true);
      expect(res.body.status).toBe('eligible');
      expect(res.body.firedRuleIds).toContain('RULE_AGE_MIN');
      expect(res.body.firedRuleIds).toContain('RULE_AGE_MAX');
      expect(res.body.firedRuleIds).toContain('RULE_INCOME_BAND');
      expect(res.body.firedRuleIds).toContain('RULE_BANK_ACCOUNT');
    });

    it('returns 200 with eligible: false when profile fails criteria', async () => {
      const payload = {
        profile: {
          age: 55, // exceeds age_max 50
          income_band: '1L_3L',
          has_bank_account: true
        },
        criteria: {
          age_min: 18,
          age_max: 50
        }
      };

      const res = await request(app)
        .post('/api/eligibility/check')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.eligible).toBe(false);
      expect(res.body.status).toBe('ineligible');
      expect(res.body.firedRuleIds).toContain('RULE_AGE_MAX');
      expect(res.body.reasons.some(r => r.includes('Maximum age 50 exceeded'))).toBe(true);
    });

    it('returns 200 when profile fields are supplied at root level of body', async () => {
      const payload = {
        age: 26,
        income_band: 'below_1L',
        criteria: {
          age_min: 18,
          age_max: 60,
          income_max_band: '1L_3L'
        }
      };

      const res = await request(app)
        .post('/api/eligibility/check')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.eligible).toBe(true);
      expect(res.body.firedRuleIds).toContain('RULE_AGE_MIN');
      expect(res.body.firedRuleIds).toContain('RULE_INCOME_BAND');
    });

    it('returns 200 evaluating against a specific scheme_id', async () => {
      const mockScheme = {
        _id: 'scheme_pmsby_123',
        name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
        eligibility_criteria: {
          age_min: 18,
          age_max: 70,
          custom_rules: { requires_bank_account: true }
        }
      };

      vi.spyOn(Scheme, 'findOne').mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockScheme)
      });

      const payload = {
        profile: {
          age: 40,
          has_bank_account: true
        },
        scheme_id: 'scheme_pmsby_123'
      };

      const res = await request(app)
        .post('/api/eligibility/check')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.scheme).toBe(mockScheme.name);
      expect(res.body.eligible).toBe(true);
      expect(res.body.firedRuleIds).toContain('RULE_AGE_MIN');
      expect(res.body.firedRuleIds).toContain('RULE_AGE_MAX');
      expect(res.body.firedRuleIds).toContain('RULE_BANK_ACCOUNT');
    });

    it('returns 200 evaluating across all active schemes in the database', async () => {
      const mockSchemes = [
        {
          _id: 'sch_1',
          name: 'Eligible Youth Scheme',
          type: 'government_scheme',
          eligibility_criteria: { age_min: 18, age_max: 35 }
        },
        {
          _id: 'sch_2',
          name: 'Senior Only Scheme',
          type: 'government_scheme',
          eligibility_criteria: { age_min: 60, age_max: 90 }
        }
      ];

      vi.spyOn(Scheme, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockSchemes)
      });

      const payload = {
        profile: { age: 25 }
      };

      const res = await request(app)
        .post('/api/eligibility/check')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.totalEvaluated).toBe(2);
      expect(res.body.eligibleCount).toBe(1);
      expect(res.body.matches[0].name).toBe('Eligible Youth Scheme');
    });
  });

  // ==========================================
  // 400 Bad Request — Input Validation Tests
  // ==========================================
  describe('400 Bad Request (Invalid Input) Cases', () => {
    it('returns 400 if request body is completely empty', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/request body is required/i);
    });

    it('returns 400 if profile is explicitly null', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: null });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/valid JSON object/i);
    });

    it('returns 400 if profile is not an object (string or number)', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: 'invalid_string' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/valid JSON object/i);
    });

    it('returns 400 if profile is an array', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: [1, 2, 3] });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/valid JSON object/i);
    });

    it('returns 400 if age is non-numeric string', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: { age: 'thirty' } });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/age must be a non-negative number/i);
    });

    it('returns 400 if age is negative', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: { age: -5 } });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/age must be a non-negative number/i);
    });

    it('returns 400 if income_band is not a string', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: { income_band: 100000 } });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/income_band must be a string/i);
    });

    it('returns 400 if has_bank_account is not a boolean', async () => {
      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: { has_bank_account: 'yes_in_sbi' } });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/has_bank_account must be a boolean/i);
    });
  });

  // ==========================================
  // 500 Internal Server Error — Failure Tests
  // ==========================================
  describe('500 Service Failure Cases', () => {
    it('returns 500 when database fails during multi-scheme query', async () => {
      vi.spyOn(Scheme, 'find').mockImplementation(() => {
        throw new Error('Database connection dropped unexpectedly');
      });

      const res = await request(app)
        .post('/api/eligibility/check')
        .send({ profile: { age: 30 } });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Service failure during eligibility check/i);
      expect(res.body.message).toBe('Database connection dropped unexpectedly');
    });

    it('returns 500 when RuleEngine evaluation encounters an unexpected runtime error', async () => {
      vi.spyOn(RuleEngine, 'evaluate').mockImplementation(() => {
        throw new Error('Deterministic rule processor memory fault');
      });

      const res = await request(app)
        .post('/api/eligibility/check')
        .send({
          profile: { age: 30 },
          criteria: { age_min: 18 }
        });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Service failure during eligibility check/i);
      expect(res.body.message).toBe('Deterministic rule processor memory fault');
    });
  });
});
