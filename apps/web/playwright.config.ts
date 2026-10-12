import { defineConfig, devices } from '@playwright/test';

const isContinuousIntegration = Boolean(process.env.CI);
const stubPort = Number(process.env.E2E_STRAPI_STUB_PORT ?? 1338);
const webPort = Number(process.env.E2E_WEB_PORT ?? 4173);
const webUrl = `http://127.0.0.1:${webPort}`;
const stubUrl = `http://127.0.0.1:${stubPort}`;
// Always test against the co-located stub. An ambient STRAPI_URL (e.g. from
// the repo-root .env, which points at a dev CMS that may not be running)
// would render every seed-content page "temporarily unavailable".
const strapiUrl = stubUrl;

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
      command: `E2E_STRAPI_STUB_PORT=${stubPort} bun run tests/e2e/strapi-stub.ts`,
      url: `${stubUrl}/api/site-setting`,
      // Never reuse: a stray stub serves outdated seed content and the
      // failure looks like a content regression instead of a setup issue.
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `CONTENT_SOURCE=strapi STRAPI_URL=${strapiUrl} bun run preview -- --host 127.0.0.1 --port ${webPort} --strictPort`,
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
