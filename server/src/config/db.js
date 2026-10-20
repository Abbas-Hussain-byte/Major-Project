import dns from 'node:dns';
import mongoose from 'mongoose';
import { ENV } from './env.js';

// Node 17+ prefers IPv6. Atlas on Windows often aborts that handshake with
// "tlsv1 alert internal error / SSL alert number 80". Prefer IPv4 first.
dns.setDefaultResultOrder('ipv4first');

const isTlsAlert80 = (err) =>
  /tlsv1 alert internal error|SSL alert number 80/i.test(err?.message || '');

export const connectDB = async () => {
  if (!ENV.MONGO_URI) {
    console.error('❌ MongoDB connection error: MONGO_URI is not set in server/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 15000,
      dbName: 'benefitlens',
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    if (isTlsAlert80(err)) {
      console.error(
        [
          '   TLS handshake to MongoDB Atlas failed (SSL alert 80). Check, in order:',
          '   1. Atlas → Network Access: allow this machine’s IP (or 0.0.0.0/0 for local dev).',
          '   2. Atlas → Database: cluster is not paused (free clusters pause after idle time).',
          '   3. Atlas → Database Access: user in MONGO_URI exists and can read/write.',
          '   4. MONGO_URI is mongodb+srv://... copied from Atlas “Connect” → Drivers.',
        ].join('\n')
      );
    }
  }
};
