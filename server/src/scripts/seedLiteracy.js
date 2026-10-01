import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import KnowledgeSource from '../models/KnowledgeSource.js';
import LiteracyContent from '../models/LiteracyContent.js';
import { embed } from '../services/embeddings/embeddingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const seed = async () => {
  try {
    if (!ENV.MONGO_URI) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }
    await mongoose.connect(ENV.MONGO_URI);
    console.log('Connected to MongoDB');

    const filePath = path.join(__dirname, '../../../docs/literacy-chunks.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const chunk of data) {
      // Upsert KnowledgeSource
      let source = await KnowledgeSource.findOne({ source_url: chunk.source_url });
      if (!source) {
        source = new KnowledgeSource({
          organization: chunk.organization,
          source_url: chunk.source_url,
          source_type: chunk.source_type,
          title: `${chunk.organization} ${chunk.topic} guide`,
        });
        await source.save();
        console.log(`Created source: ${source.source_url}`);
      }

      // Upsert LiteracyContent
      let doc = await LiteracyContent.findOne({ title: chunk.title }).select('+embedding');
      
      const needsEmbedding = !doc || !doc.embedding || doc.embedding.length !== 256;

      if (!doc) {
        doc = new LiteracyContent({
          source_id: source._id,
          title: chunk.title,
          topic: chunk.topic,
          content_text: chunk.content_text,
          language: 'en'
        });
      } else {
        doc.content_text = chunk.content_text;
      }

      if (needsEmbedding) {
        let success = false;
        let retries = 0;
        let vector = [];
        while (!success && retries < 5) {
          try {
            vector = await embed(chunk.content_text, 'RETRIEVAL_DOCUMENT');
            success = true;
          } catch (err) {
            if (err.message.includes('429')) {
              retries++;
              const waitTime = Math.pow(2, retries) * 1000;
              console.log(`429 Too Many Requests. Retrying in ${waitTime}ms...`);
              await sleep(waitTime);
            } else {
              throw err;
            }
          }
        }
        
        if (!success) {
          throw new Error(`Failed to embed chunk after retries: ${chunk.title}`);
        }
        
        doc.embedding = vector;
        console.log(`Embedded chunk: ${chunk.title}`);
      }

      await doc.save();
      console.log(`Saved chunk: ${chunk.title}`);
    }

    console.log('Seeding complete.');
    return;
  } catch (err) {
    console.error('Seeding error:', err);
    throw err;
  }
};

export { seed };

if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}
