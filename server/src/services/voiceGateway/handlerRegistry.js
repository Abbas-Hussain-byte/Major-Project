const handlers = new Map();

export const registerHandler = (moduleName, fn) => {
  handlers.set(moduleName, fn);
};

export const getHandler = (moduleName) => {
  return handlers.get(moduleName);
};

// DEV-only echo handler
if (process.env.NODE_ENV !== 'production') {
  registerHandler('echo', async (englishQuery) => {
    return `You said: ${englishQuery}`;
  });
}
