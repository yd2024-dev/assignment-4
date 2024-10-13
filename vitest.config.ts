// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global test APIs
    environment: 'node', // Use Node.js environment
    setupFiles: './test/setup.ts', // Optional: specify setup files if needed
    // Add any other options you need
  },
});
