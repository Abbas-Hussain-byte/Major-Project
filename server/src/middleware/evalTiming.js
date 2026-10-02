import { ENV } from '../config/env.js';

export const startTiming = (req, res, next) => {
  if (process.env.EVAL_TIMING === 'true' && process.env.NODE_ENV !== 'production') {
    req.evalTiming = { start: Date.now(), stages: {} };
    
    // Patch res.json to add the header before sending
    const originalJson = res.json;
    res.json = function (body) {
      if (req.evalTiming) {
        req.evalTiming.total = Date.now() - req.evalTiming.start;
        res.setHeader('x-eval-timing', JSON.stringify(req.evalTiming.stages));
        res.setHeader('x-eval-total-time', req.evalTiming.total);
      }
      return originalJson.call(this, body);
    };
  }
  next();
};

export const recordStage = (req, stageName, durationMs) => {
  if (req && req.evalTiming) {
    req.evalTiming.stages[stageName] = durationMs;
  }
};
