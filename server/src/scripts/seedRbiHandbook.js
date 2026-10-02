import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfRaw = require('pdf-parse');
const pdf = typeof pdfRaw === 'function' ? pdfRaw : (pdfRaw.default || pdfRaw.PDFParse || pdfRaw);
import { ENV } from '../config/env.js';
import { geminiEmbed } from '../services/llm/geminiService.js';
import LiteracyContent from '../models/LiteracyContent.js';
import KnowledgeSource from '../models/KnowledgeSource.js';

// Configuration
const CHUNK_SIZE = 1000; // Characters per chunk
const CHUNK_OVERLAP = 200; // Character overlap between chunks

/**
 * Clean messy PDF text by removing excessive newlines and artifacts.
 */
function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple blank lines
    .replace(/([a-z])-\n([a-z])/ig, '$1$2') // Fix hyphenated line breaks
    .replace(/([^\n])\n([^\n])/g, '$1 $2') // Join lines that shouldn't be broken
    .trim();
}

/**
 * Split a large string into overlapping chunks.
 */
function chunkText(text, size, overlap) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    let end = i + size;
    // Try to break at a natural boundary (period, newline, space) if possible
    if (end < text.length) {
      const boundary = text.lastIndexOf('. ', end);
      if (boundary > i + (size / 2)) {
        end = boundary + 1; // Include the period
      }
    }
    chunks.push(text.slice(i, end).trim());
    i = end - overlap; // step forward, leaving overlap
  }
  return chunks;
}

const seedHandbook = async () => {
  try {
    const limit = process.argv.includes('--limit') 
      ? parseInt(process.argv[process.argv.indexOf('--limit') + 1], 10) 
      : null;

    console.log('Connecting to database...');
    await mongoose.connect(ENV.MONGO_URI);

    // Ensure the RBI KnowledgeSource exists
    let rbiSource = await KnowledgeSource.findOne({ organization: 'RBI' });
    if (!rbiSource) {
      rbiSource = await KnowledgeSource.create({
        organization: 'RBI',
        source_url: 'https://www.rbi.org.in/',
        source_type: 'Handbook',
      });
      console.log('Created RBI KnowledgeSource');
    }

    const filePath = path.resolve('..', '..', 'all financial files', 'FE_Handbook_Eng.pdf');
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    console.log('Reading and parsing PDF...');
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    console.log(`PDF Parsed. Pages: ${pdfData.numpages}`);
    const cleanedText = cleanText(pdfData.text);
    
    console.log('Chunking text...');
    const textChunks = chunkText(cleanedText, CHUNK_SIZE, CHUNK_OVERLAP);
    console.log(`Generated ${textChunks.length} chunks.`);

    const chunksToProcess = limit ? textChunks.slice(0, limit) : textChunks;
    if (limit) {
      console.log(`Limiting ingestion to the first ${limit} chunks due to --limit flag.`);
    }

    console.log(`Embedding and saving ${chunksToProcess.length} chunks to LiteracyContent...`);
    
    let successCount = 0;
    for (let i = 0; i < chunksToProcess.length; i++) {
      const contentText = chunksToProcess[i];
      if (contentText.length < 50) continue; // Skip tiny garbage chunks
      
      try {
        // Our geminiService already has exponential backoff for 429s built-in!
        const embedding = await geminiEmbed(contentText, 'RETRIEVAL_DOCUMENT');
        
        await LiteracyContent.create({
          source_id: rbiSource._id,
          title: `RBI Handbook - Section ${i + 1}`,
          topic: 'Financial Education',
          content_text: contentText,
          language: 'en',
          embedding: embedding
        });

        successCount++;
        process.stdout.write(`\rProgress: ${successCount}/${chunksToProcess.length}`);
      } catch (err) {
        console.error(`\nFailed to process chunk ${i + 1}:`, err.message);
      }
    }

    console.log(`\n\nSuccessfully ingested ${successCount} new chunks into the Literacy Database!`);
    process.exit(0);
  } catch (err) {
    console.error('Fatal Error:', err);
    process.exit(1);
  }
};

seedHandbook();
