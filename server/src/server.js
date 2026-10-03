import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

export default app;
export { app };

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer();
}
