import { defineConfig, devices } from '@playwright/test';

const isContinuousIntegration = Boolean(process.env.CI);
const stubPort = Number(process.env.E2E_SANITY_STUB_PORT ?? 1380);
const webPort = Number(process.env.E2E_WEB_PORT ?? 4173);
const webUrl = `http://127.0.0.1:${webPort}`;
const stubUrl = `http://127.0.0.1:${stubPort}`;
// Always test against the co-located stub. An ambient Sanity dataset
// (e.g. from the repo-root .env) would render every seed-content page
// "temporarily unavailable" when credentials or network differ.
const sanityApiHost = stubUrl;

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
    baseURL: webUrl,
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
      command: `E2E_SANITY_STUB_PORT=${stubPort} bun run tests/e2e/sanity-stub.ts`,
      url: `${stubUrl}/v2025-09-01/data/query/production?query=*`,
      // Never reuse: a stray stub serves outdated seed content and the
      // failure looks like a content regression instead of a setup issue.
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `CONTENT_SOURCE=sanity SANITY_API_HOST=${sanityApiHost} bun run preview -- --host 127.0.0.1 --port ${webPort} --strictPort`,
      url: webUrl,
      // Never reuse: a preview started without the e2e env serves different
      // content and fails the seed-content assertions. strictPort turns a
      // port collision into a loud startup error instead of silently testing
      // the wrong server.
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
