// vitest.config.ts
const { defineConfig } = require('vitest/config');

async function createConfig() {
  // Your asynchronous logic here (if needed)

  return defineConfig({
    test: {
      globals: true, // Enable global test APIs
      environment: 'node', // Use Node.js environment
      // Add any other options you need
    },
  });
}

module.exports = createConfig();

