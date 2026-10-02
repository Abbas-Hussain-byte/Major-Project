import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { embed, cosineSimilarity } from '../services/embeddings/embeddingService.js';
import LiteracyContent from '../models/LiteracyContent.js';

const OUT_DIR = path.resolve('eval-out');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const evalRetrieval = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    
    const filePath = path.resolve('..', 'docs', 'rag-evaluation-set.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const calibration = [];
    const heldOut = [];
    data.forEach((item, index) => {
      item.is_answerable = item.expected_status === 'grounded';
      if (index % 2 === 0) calibration.push(item);
      else heldOut.push(item);
    });

    const allDocs = await LiteracyContent.find({}).select('+embedding').lean();
    if (allDocs.length === 0) {
      console.error('Database empty. Please seed literacy first.');
      process.exit(1);
    }
    
    console.log('Precomputing query embeddings with rate limiting...');
    for (const test of [...calibration, ...heldOut]) {
      await new Promise(r => setTimeout(r, 2000));
      test.embedding = await embed(test.query, 'RETRIEVAL_QUERY');
    }
    
    const thresholds = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    let bestThreshold = 0.3;
    let bestScore = -1;
    let bestHit3 = 0;
    
    console.log('--- CALIBRATION SET ---');
    const peakMetrics = { hitAt3: { val: -1, thresh: -1 }, cr: { val: -1, thresh: -1 } };
    const sweepData = [];
    
    for (const threshold of thresholds) {
      let hitAt3 = 0;
      let correctRefusal = 0;
      
      for (const test of calibration) {
        const scored = allDocs
          .filter(doc => doc.embedding && doc.embedding.length > 0)
          .map(doc => ({ title: doc.title, score: cosineSimilarity(test.embedding, doc.embedding) }))
          .sort((a, b) => b.score - a.score)
          .filter(r => r.score >= threshold)
          .slice(0, 3);
          
        if (test.is_answerable) {
          const titles = scored.map(s => s.title);
          if (titles.includes(test.expected_chunk_title)) hitAt3++;
        } else {
          if (scored.length === 0) correctRefusal++;
        }
      }
      
      const answerableCount = calibration.filter(c => c.is_answerable).length;
      const unanswerableCount = calibration.length - answerableCount;
      const crRate = unanswerableCount ? correctRefusal / unanswerableCount : 0;
      const hitRate = answerableCount ? hitAt3 / answerableCount : 0;
      
      if (hitRate > peakMetrics.hitAt3.val) {
        peakMetrics.hitAt3.val = hitRate;
        peakMetrics.hitAt3.thresh = threshold;
      }
      if (crRate > peakMetrics.cr.val) {
        peakMetrics.cr.val = crRate;
        peakMetrics.cr.thresh = threshold;
      }
      
      const combinedScore = (hitRate * 0.4) + (crRate * 0.6);
      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestThreshold = threshold;
        bestHit3 = hitAt3;
      }
      
      sweepData.push({ threshold, hitRate, crRate, combinedScore });
    }
    
    console.log(`Peak Hit@3: ${peakMetrics.hitAt3.val.toFixed(2)} at thresh ${peakMetrics.hitAt3.thresh}`);
    console.log(`Peak CR: ${peakMetrics.cr.val.toFixed(2)} at thresh ${peakMetrics.cr.thresh}`);
    console.log(`Selected Best Threshold (combined): ${bestThreshold.toFixed(1)}`);
    console.log('\n--- HELD-OUT SET ---');
    
    let hitAt1 = 0;
    let hitAt3 = 0;
    let mrrSum = 0;
    
    for (const test of heldOut) {
      if (!test.is_answerable) continue;
      
      const scored = allDocs
        .filter(doc => doc.embedding && doc.embedding.length > 0)
        .map(doc => ({ title: doc.title, score: cosineSimilarity(test.embedding, doc.embedding) }))
        .sort((a, b) => b.score - a.score)
        .filter(r => r.score >= bestThreshold)
        .slice(0, 3);
        
      if (scored.length > 0 && scored[0].title === test.expected_chunk_title) {
        hitAt1++;
      }
      
      let rank = -1;
      for (let i = 0; i < scored.length; i++) {
        if (scored[i].title === test.expected_chunk_title) {
          rank = i + 1;
          break;
        }
      }
      
      if (rank > 0) {
        hitAt3++;
        mrrSum += (1 / rank);
      }
    }
    
    const answerableCount = heldOut.filter(c => c.is_answerable).length;
    const result = {
      threshold: bestThreshold,
      hit1: answerableCount ? hitAt1 / answerableCount : 0,
      hit3: answerableCount ? hitAt3 / answerableCount : 0,
      mrr: answerableCount ? mrrSum / answerableCount : 0,
      sweepData,
      metadata: {
        embeddingModel: ENV.GEMINI_EMBED_MODEL,
        dims: 256,
        chunkCount: allDocs.length
      }
    };
    
    fs.writeFileSync(path.join(OUT_DIR, 'retrieval-results.json'), JSON.stringify(result, null, 2));
    console.log('Wrote retrieval-results.json');
    process.exit(0);
  } catch (err) {
    console.error('Eval error:', err);
    process.exit(1);
  }
};

evalRetrieval();
