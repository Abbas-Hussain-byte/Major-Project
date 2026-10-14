import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'express-async-errors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import eligibilityRoutes from './routes/eligibility.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import literacyRoutes from './routes/literacy.routes.js';
import incomeExpenseRoutes from './routes/incomeExpense.routes.js';
import adminRoutes from './routes/admin.routes.js';

import rateLimit from 'express-rate-limit';
import { startTiming } from './middleware/evalTiming.js';

const app = express();
app.set('trust proxy', 1);

app.use(startTiming);
app.use(express.json());

const parseOrigins = (raw) => {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean);
};

const configuredOrigins = parseOrigins(ENV.CLIENT_ORIGIN);
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];
const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (ENV.CLIENT_ORIGIN === '*' || allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    if (/\.vercel\.app$/.test(cleanOrigin) || /\.onrender\.com$/.test(cleanOrigin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const voiceRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_VOICE_WINDOW_MS,
  max: ENV.RATE_LIMIT_VOICE_MAX,
  message: { error: 'Too many voice requests, please try again later.' }
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/voice', voiceRateLimiter, voiceRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/literacy', voiceRateLimiter, literacyRoutes);
app.use('/api/income-expense', incomeExpenseRoutes);
app.use('/api/admin', adminRoutes);

// In production / unified container: Serve built React client assets
const candidateDistPaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../public'),
  path.resolve('public'),
  path.resolve('client/dist'),
];
const clientDist = candidateDistPaths.find(p => fs.existsSync(p));

if (clientDist) {
  app.use(express.static(clientDist, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (
        filePath.endsWith('.html') ||
        filePath.endsWith('sw.js') ||
        filePath.endsWith('registerSW.js') ||
        filePath.endsWith('.webmanifest')
      ) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(errorHandler);

export default app;
export { app };
