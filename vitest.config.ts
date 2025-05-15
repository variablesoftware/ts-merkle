import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30_000, // Set default per-test timeout to 20 seconds
    timeout: 600_000,    // Keep total test run timeout at 5 minutes
  },
});
