import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4182', screenshot: 'only-on-failure' },
  webServer: {
    command: 'bun run preview',
    url: 'http://127.0.0.1:4182',
    reuseExistingServer: false,
  },
});
