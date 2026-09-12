import { defineConfig, devices } from '@playwright/test';

const isContinuousIntegration = Boolean(process.env.CI);
const stubPort = Number(process.env.E2E_STRAPI_STUB_PORT ?? 1338);
const stubUrl = `http://127.0.0.1:${stubPort}`;
const strapiUrl = process.env.STRAPI_URL ?? stubUrl;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isContinuousIntegration,
  retries: isContinuousIntegration ? 2 : 1,
  workers: isContinuousIntegration ? 1 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: isContinuousIntegration ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      testIgnore: '**/*.mobile.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      testMatch: '**/*.mobile.spec.ts',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: [
    {
      command: `E2E_STRAPI_STUB_PORT=${stubPort} bun run tests/e2e/strapi-stub.ts`,
      url: `${stubUrl}/api/site-setting`,
      reuseExistingServer: !isContinuousIntegration,
      timeout: 30_000,
    },
    {
      command: `CONTENT_SOURCE=strapi STRAPI_URL=${strapiUrl} bun run preview -- --host 127.0.0.1 --port 4173`,
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !isContinuousIntegration,
      timeout: 120_000,
    },
  ],
});
