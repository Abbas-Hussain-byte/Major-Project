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

const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_ORIGIN }));
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/literacy', literacyRoutes);
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
