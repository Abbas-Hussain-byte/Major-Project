/**
 * Global error handler — must be registered LAST in Express middleware chain.
 * Returns consistent JSON shape: { message, ...(dev-only stack) }
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[${new Date().toISOString()}] ${status} ${req.method} ${req.path}`, err.message);

  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
};

/** Convenience: attach statusCode to an error and throw it */
export const createError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};
