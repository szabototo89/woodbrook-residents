import { defineConfig, devices } from '@playwright/test';

const isContinuousIntegration = Boolean(process.env.CI);
const strapiUrl = process.env.STRAPI_URL ?? 'http://127.0.0.1:1337';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isContinuousIntegration,
  retries: isContinuousIntegration ? 1 : 0,
  workers: isContinuousIntegration ? 1 : undefined,
  reporter: isContinuousIntegration ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
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
  webServer: {
    command: `CONTENT_SOURCE=strapi STRAPI_URL=${strapiUrl} bun run preview -- --host 127.0.0.1 --port 4173`,
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !isContinuousIntegration,
    timeout: 120_000,
  },
});
