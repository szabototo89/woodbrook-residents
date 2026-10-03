import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

test('CI bounds browser workers so native touch gestures are not starved', async () => {
  vi.stubEnv('CI', 'true');
  vi.resetModules();
  const { default: config } = await import('../../../playwright.config');
  expect(config.workers).toBe(2);
  expect(config.retries).toBe(0);
});
