import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import './tests/fixtures/gallery-fetch.mjs';

const port = Number(process.env.LAURA_PLAYWRIGHT_PORT ?? 4176);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `bun run preview -- --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    env: {
      NODE_OPTIONS: [
        process.env.NODE_OPTIONS,
        `--import=${fileURLToPath(new URL('./tests/fixtures/gallery-fetch.mjs', import.meta.url))}`,
      ]
        .filter(Boolean)
        .join(' '),
    },
  },
});
