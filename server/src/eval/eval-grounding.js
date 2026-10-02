import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { answerQuestion } from '../services/literacyTutor/literacyService.js';

const OUT_DIR = path.resolve('eval-out');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const evalGrounding = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    
    const filePath = path.resolve('..', 'docs', 'rag-evaluation-set.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const heldOut = [];
    data.forEach((item, index) => {
      item.is_answerable = item.expected_status === 'grounded';
      if (index % 2 !== 0) heldOut.push(item);
    });

    console.log(`Running grounding eval on ${heldOut.length} held-out queries...`);
    
    let cr = 0;
    let fg = 0;
    let llmUnavailable = 0;
    let otherError = 0;
    let groundedTotal = 0;
    let groundedCorrect = 0;
    let answerableGroundedCorrect = 0;

    const answerable = heldOut.filter(i => i.is_answerable);
    const outOfScope = heldOut.filter(i => !i.is_answerable);

    for (const test of heldOut) {
      await new Promise(r => setTimeout(r, 8000));
      // The answerQuestion handles both retrieval and LLM grounding
      let result;
      try {
        result = await answerQuestion(test.query);
      } catch (err) {
        result = { status: err.name === 'LlmUnavailableError' ? 'llm_unavailable' : 'error' };
      }
      
      const isRetrieved = result.status === 'grounded' && result.sources && result.sources.length > 0;
      
      if (test.is_answerable) {
        if (isRetrieved) {
          const titles = result.sources.map(s => s.title);
          if (titles.includes(test.expected_chunk_title)) {
            groundedCorrect++;
            answerableGroundedCorrect++;
          }
          groundedTotal++;
        }
      } else {
        if (result.status === 'not_grounded') {
          cr++;
        } else if (result.status === 'grounded') {
          fg++;
          groundedTotal++;
        } else if (result.status === 'llm_unavailable') {
          llmUnavailable++;
        } else {
          otherError++;
        }
      }
    }
    
    const precision = groundedTotal === 0 ? 0 : (groundedCorrect / groundedTotal);
    const recall = answerable.length === 0 ? 0 : (answerableGroundedCorrect / answerable.length);
    const f05 = (precision + recall === 0) ? 0 : ((1 + 0.5**2) * precision * recall) / ((0.5**2 * precision) + recall);

    const metrics = {
      precision,
      recall,
      f05,
      cr: outOfScope.length ? cr / outOfScope.length : 0,
      fg: outOfScope.length ? fg / outOfScope.length : 0,
      confusionMatrix: {
        truePositives: answerableGroundedCorrect,
        falseNegatives: answerable.length - answerableGroundedCorrect,
        trueNegatives: cr,
        falsePositives: fg,
        errors: llmUnavailable + otherError
      },
      outOfScopeBreakdown: {
        refused: cr,
        grounded: fg,
        llm_unavailable: llmUnavailable,
        error: otherError
      },
      metadata: {
        chatModel: ENV.GEMINI_CHAT_MODEL
      }
    };
    
    fs.writeFileSync(path.join(OUT_DIR, 'grounding-results.json'), JSON.stringify(metrics, null, 2));
    console.log('Wrote grounding-results.json');
    process.exit(0);
  } catch (err) {
    console.error('Eval error:', err);
    process.exit(1);
  }
};

evalGrounding();
