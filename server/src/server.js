import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
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
const allowedOrigins = [
  ENV.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

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

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
};

startServer();
// Server entry point ready

