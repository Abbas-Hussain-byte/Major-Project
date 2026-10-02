import fs from 'fs';
import path from 'path';

// Simple tokenizer
const tokenize = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 0);

// BM25 implementation
export class BM25 {
  constructor(corpus) {
    this.documents = corpus;
    this.docLengths = [];
    this.termFreqs = [];
    this.docCount = corpus.length;
    this.avgDocLength = 0;
    this.docFreqs = {};

    let totalLength = 0;

    corpus.forEach((doc, idx) => {
      const tokens = tokenize(doc.content_text);
      this.docLengths.push(tokens.length);
      totalLength += tokens.length;

      const tf = {};
      const uniqueTokens = new Set();

      tokens.forEach(t => {
        tf[t] = (tf[t] || 0) + 1;
        uniqueTokens.add(t);
      });

      this.termFreqs.push(tf);

      uniqueTokens.forEach(t => {
        this.docFreqs[t] = (this.docFreqs[t] || 0) + 1;
      });
    });

    this.avgDocLength = totalLength / this.docCount;
  }

  score(queryTokens, docIdx, k1 = 1.5, b = 0.75) {
    let score = 0;
    const tf = this.termFreqs[docIdx];
    const docLen = this.docLengths[docIdx];

    queryTokens.forEach(token => {
      if (!this.docFreqs[token]) return;

      // IDF
      const idf = Math.log(1 + (this.docCount - this.docFreqs[token] + 0.5) / (this.docFreqs[token] + 0.5));
      
      const termFreq = tf[token] || 0;
      const numerator = termFreq * (k1 + 1);
      const denominator = termFreq + k1 * (1 - b + b * (docLen / this.avgDocLength));
      
      score += idf * (numerator / denominator);
    });

    return score;
  }

  search(query, topK = 3) {
    const queryTokens = tokenize(query);
    const scores = [];

    for (let i = 0; i < this.docCount; i++) {
      scores.push({
        idx: i,
        score: this.score(queryTokens, i),
        doc: this.documents[i]
      });
    }

    return scores.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}

export const runKeywordBaseline = (chunksPath, evalSetPath) => {
  const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
  const bm25 = new BM25(chunks);

  const evalSet = JSON.parse(fs.readFileSync(evalSetPath, 'utf8'));
  const calibration = [];
  const heldOut = [];
  evalSet.forEach((item, index) => {
    item.is_answerable = item.expected_status === 'grounded';
    if (index % 2 === 0) calibration.push(item);
    else heldOut.push(item);
  });

  // Sweep threshold on calibration to find optimal F0.5 or hit rate
  const thresholds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];
  let bestThreshold = 0;
  let bestHit3 = -1;
  let bestCR = -1;

  thresholds.forEach(t => {
    let hits3 = 0, cr = 0;
    calibration.forEach(item => {
      const results = bm25.search(item.query, 3);
      if (item.is_answerable) {
        if (results.length > 0 && results[0].score >= t) {
          const found = results.some(r => r.doc.title === item.expected_chunk_title);
          if (found) hits3++;
        }
      } else {
        if (results.length === 0 || results[0].score < t) {
          cr++;
        }
      }
    });
    
    // Maximize CR, then Hits@3
    if (cr > bestCR || (cr === bestCR && hits3 > bestHit3)) {
      bestCR = cr;
      bestHit3 = hits3;
      bestThreshold = t;
    }
  });

  // Evaluate on held-out
  let hit1 = 0;
  let hit3 = 0;
  let mrrSum = 0;
  let correctRefusal = 0;
  let falseGrounding = 0;

  const answerable = heldOut.filter(i => i.is_answerable);
  const outOfScope = heldOut.filter(i => !i.is_answerable);

  let baselineGroundedTotal = 0;
  let baselineGroundedCorrect = 0;
  let baselineAnswerableGroundedCorrect = 0;

  heldOut.forEach(item => {
    const results = bm25.search(item.query, 3);
    const topDocScore = results.length > 0 ? results[0].score : 0;
    const isRetrieved = topDocScore >= bestThreshold;

    if (item.is_answerable) {
      if (isRetrieved) {
        if (results[0].doc.title === item.expected_chunk_title) hit1++;
        
        let rank = -1;
        for (let i = 0; i < results.length; i++) {
          if (results[i].doc.title === item.expected_chunk_title) {
            rank = i + 1;
            break;
          }
        }
        
        if (rank > 0) {
          hit3++;
          mrrSum += (1 / rank);
          baselineGroundedCorrect++;
          baselineAnswerableGroundedCorrect++;
        }
        baselineGroundedTotal++;
      }
    } else {
      if (!isRetrieved) {
        correctRefusal++;
      } else {
        falseGrounding++;
        baselineGroundedTotal++;
      }
    }
  });

  const precision = baselineGroundedTotal === 0 ? 0 : (baselineGroundedCorrect / baselineGroundedTotal);
  const recall = answerable.length === 0 ? 0 : (baselineAnswerableGroundedCorrect / answerable.length);
  const f05 = (precision + recall === 0) ? 0 : ((1 + 0.5**2) * precision * recall) / ((0.5**2 * precision) + recall);

  return {
    threshold: bestThreshold,
    metrics: {
      hit1: answerable.length ? (hit1 / answerable.length) : 0,
      hit3: answerable.length ? (hit3 / answerable.length) : 0,
      mrr: answerable.length ? (mrrSum / answerable.length) : 0,
      cr: outOfScope.length ? (correctRefusal / outOfScope.length) : 0,
      fg: outOfScope.length ? (falseGrounding / outOfScope.length) : 0,
      precision,
      recall,
      f05
    }
  };
};
