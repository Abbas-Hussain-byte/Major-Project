import 'dotenv/config';

const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'BHASHINI_USER_ID',
  'BHASHINI_API_KEY',
  'GEMINI_API_KEY',
];

for (const key of required) {
  if (!process.env[key]) {
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
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',

  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
