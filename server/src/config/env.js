import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY',
];

for (const key of required) {
  if (!process.env[key] && !process.env.VITEST) {
    console.warn(`⚠️  Missing env var: ${key} — some features will be stubbed`);
  }
}

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  BHASHINI_USER_ID: process.env.BHASHINI_USER_ID || '',
  BHASHINI_API_KEY: process.env.BHASHINI_API_KEY || '',
  BHASHINI_PIPELINE_ID: process.env.BHASHINI_PIPELINE_ID || '',

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash',
  GEMINI_EMBED_MODEL: process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-2',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',

  SARVAM_API_KEY: process.env.SARVAM_API_KEY || '',

  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  VOICE_PROVIDERS: (process.env.VOICE_PROVIDERS || 'sarvam,browser_gemini').split(',').map(s => s.trim()),
  RATE_LIMIT_VOICE_WINDOW_MS: parseInt(process.env.RATE_LIMIT_VOICE_WINDOW_MS || '900000', 10),
  RATE_LIMIT_VOICE_MAX: parseInt(process.env.RATE_LIMIT_VOICE_MAX || '60', 10),
};
