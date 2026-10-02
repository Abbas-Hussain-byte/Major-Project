import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['json', 'json-summary', 'text'],
      all: true,
      include: ['src/**'],
      exclude: ['src/**/*.test.js', 'src/scripts/**', 'src/eval/**']
    }
  }
});
