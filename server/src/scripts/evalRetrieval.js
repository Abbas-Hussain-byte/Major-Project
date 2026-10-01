import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { embed, cosineSimilarity } from '../services/embeddings/embeddingService.js';
import LiteracyContent from '../models/LiteracyContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const evalRetrieval = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    
    const filePath = path.join(__dirname, '../../../docs/rag-evaluation-set.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Split into calibration (first 15) and held-out (next 15)
    // To ensure a mix of answerable and out-of-scope in both, we will just alternate
    const calibration = [];
    const heldOut = [];
    
    data.forEach((item, index) => {
      if (index % 2 === 0) {
        calibration.push(item);
      } else {
        heldOut.push(item);
      }
    });

    const allDocs = await LiteracyContent.find({}).select('+embedding').lean();
    
    if (allDocs.length === 0) {
      console.log('Database empty. Please run seed script first.');
      process.exit(1);
    }
    
    const thresholds = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
    
    console.log('--- CALIBRATION SET ---');
    let bestThreshold = 0.3;
    let bestScore = -1;
    
    for (const threshold of thresholds) {
      let hitAt3 = 0;
      let correctRefusal = 0;
      let falseGrounding = 0;
      
      for (const test of calibration) {
        const queryVec = await embed(test.query, 'RETRIEVAL_QUERY');
        
        const scored = allDocs
          .filter(doc => doc.embedding && doc.embedding.length > 0)
          .map(doc => ({
            title: doc.title,
            score: cosineSimilarity(queryVec, doc.embedding),
          }))
          .sort((a, b) => b.score - a.score)
          .filter(r => r.score >= threshold)
          .slice(0, 3);
          
        if (test.expected_status === 'grounded') {
          const titles = scored.map(s => s.title);
          if (titles.includes(test.expected_chunk_title)) {
            hitAt3++;
          }
        } else {
          if (scored.length === 0) {
            correctRefusal++;
          } else {
            falseGrounding++;
          }
        }
      }
      
      const answerableCount = calibration.filter(c => c.expected_status === 'grounded').length;
      const unanswerableCount = calibration.length - answerableCount;
      
      const hitRate = hitAt3 / answerableCount;
      const correctRefusalRate = correctRefusal / unanswerableCount;
      
      console.log(`Threshold: ${threshold.toFixed(1)} | Hit@3: ${hitAt3}/${answerableCount} | Correct Refusal: ${correctRefusal}/${unanswerableCount} | False Grounding: ${falseGrounding}/${unanswerableCount}`);
      
      // We want to maximize correct refusals while keeping hit rate high, bias towards refusing
      const combinedScore = (hitRate * 0.4) + (correctRefusalRate * 0.6);
      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestThreshold = threshold;
      }
    }
    
    console.log(`\nSelected Best Threshold: ${bestThreshold.toFixed(1)}`);
    console.log('\n--- HELD-OUT SET (Real Performance) ---');
    
    let hitAt3 = 0;
    let correctRefusal = 0;
    let falseGrounding = 0;
    
    for (const test of heldOut) {
      const queryVec = await embed(test.query, 'RETRIEVAL_QUERY');
        
      const scored = allDocs
        .filter(doc => doc.embedding && doc.embedding.length > 0)
        .map(doc => ({
          title: doc.title,
          score: cosineSimilarity(queryVec, doc.embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .filter(r => r.score >= bestThreshold)
        .slice(0, 3);
        
      if (test.expected_status === 'grounded') {
        const titles = scored.map(s => s.title);
        if (titles.includes(test.expected_chunk_title)) {
          hitAt3++;
        } else {
          console.log(`FAILED HIT: Query "${test.query}" did not find chunk "${test.expected_chunk_title}"`);
        }
      } else {
        if (scored.length === 0) {
          correctRefusal++;
        } else {
          falseGrounding++;
          console.log(`FAILED REFUSAL: Query "${test.query}" falsely grounded to chunks: ${scored.map(s => s.title).join(', ')}`);
        }
      }
    }
    
    const answerableCount = heldOut.filter(c => c.expected_status === 'grounded').length;
    const unanswerableCount = heldOut.length - answerableCount;
    
    console.log(`Held-Out Metrics for Threshold ${bestThreshold.toFixed(1)}:`);
    console.log(`Hit@3: ${hitAt3}/${answerableCount} (${((hitAt3/answerableCount)*100).toFixed(1)}%)`);
    console.log(`Correct Refusal: ${correctRefusal}/${unanswerableCount} (${((correctRefusal/unanswerableCount)*100).toFixed(1)}%)`);
    console.log(`False Grounding: ${falseGrounding}/${unanswerableCount} (${((falseGrounding/unanswerableCount)*100).toFixed(1)}%)`);
    
    console.log('\nPlease set RETRIEVAL_MIN_SCORE=' + bestThreshold.toFixed(1) + ' in your .env file.');
    
    process.exit(0);
  } catch (err) {
    console.error('Eval error:', err);
    process.exit(1);
  }
};

evalRetrieval();
