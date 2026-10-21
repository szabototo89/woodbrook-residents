import { defineConfig, devices } from '@playwright/test';

const stubPort = Number(process.env.FIREBASE_E2E_STUB_PORT ?? 1487);
const webPort = Number(process.env.FIREBASE_E2E_WEB_PORT ?? 4287);
const webUrl = `http://127.0.0.1:${webPort}`;

export default defineConfig({
  testDir: './tests/firebase',
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: webUrl,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: `E2E_SANITY_STUB_PORT=${stubPort} bun run tests/e2e/sanity-stub.ts`,
      url: `http://127.0.0.1:${stubPort}/v2025-09-01/data/query/production?query=*`,
      reuseExistingServer: false,
    },
    {
      command: `VITE_FIREBASE_API_KEY=sample-public-key VITE_FIREBASE_AUTH_DOMAIN=sample.firebaseapp.com VITE_FIREBASE_PROJECT_ID=sample VITE_FIREBASE_APP_ID=1:123:web:456 VITE_FIREBASE_AUTH_ENABLED=false VITE_FIREBASE_GOOGLE_ENABLED=true VITE_FIREBASE_FACEBOOK_ENABLED=true bun run build && CONTENT_SOURCE=sanity SANITY_API_HOST=http://127.0.0.1:${stubPort} bun run preview -- --host 127.0.0.1 --port ${webPort} --strictPort`,
      url: webUrl,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
