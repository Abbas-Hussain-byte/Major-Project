import { answerQuestion } from '../literacyTutor/literacyService.js';

const handlers = new Map();

export const registerHandler = (moduleName, fn) => {
  handlers.set(moduleName, fn);
};

export const getHandler = (moduleName) => {
  return handlers.get(moduleName);
};

// Register real handlers
registerHandler('literacy', async (englishQuery) => {
  return await answerQuestion(englishQuery);
});

// DEV-only echo handler
if (process.env.NODE_ENV !== 'production') {
  registerHandler('echo', async (englishQuery) => {
    return `You said: ${englishQuery}`;
  });
}
