import { readFileSync } from 'node:fs';
import { test, expect, vi } from 'vitest';
import {
  LIGHTHOUSE_MIN_SCORES,
  LIGHTHOUSE_ROUTES,
} from '../scripts/lighthouse-config';
import { evaluateLighthouseScores } from '../../web/scripts/lighthouse-report';

const read = (file: string) => readFileSync(`${process.cwd()}/${file}`, 'utf8');

test('Cloudflare publishes the client directory with security and asset cache headers', () => {
  const config: unknown = JSON.parse(
    read('wrangler.jsonc').replace(/,\s*}/g, '}'),
  );
  expect(config).toMatchObject({ pages_build_output_dir: './dist/client' });
  expect(read('public/_headers')).toContain('X-Content-Type-Options: nosniff');
  expect(read('public/_headers')).toContain(
    'Cache-Control: public, max-age=31536000, immutable',
  );
});

test('Lighthouse accepts the homepage only when all scores meet the minimum', () => {
  expect(LIGHTHOUSE_ROUTES).toEqual(['/', '/blog']);
  expect(
    evaluateLighthouseScores(
      { performance: 90, accessibility: 90, 'best-practices': 90, seo: 90 },
      LIGHTHOUSE_MIN_SCORES,
    ).passed,
  ).toBe(true);
});

test.each(['performance', 'accessibility', 'best-practices', 'seo'])(
  'Lighthouse rejects a below-threshold %s score',
  (category) => {
    const scores = {
      performance: 100,
      accessibility: 100,
      'best-practices': 100,
      seo: 100,
      [category]: 89,
    };
    const evaluation = evaluateLighthouseScores(scores, LIGHTHOUSE_MIN_SCORES);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.failures).toEqual([expect.stringContaining(category)]);
  },
);

test.each([undefined, '4288'])(
  'browser checks select an isolated server port: %s',
  async (port) => {
    vi.stubEnv('FORMA_PLAYWRIGHT_PORT', port);
    vi.resetModules();
    try {
      const { default: config } = await import('../playwright.config');
      const expectedPort = port ?? '4178';
      expect(config).toMatchObject({
        workers: 2,
        use: { baseURL: `http://127.0.0.1:${expectedPort}` },
        webServer: {
          url: `http://127.0.0.1:${expectedPort}`,
          command: `bun run preview -- --host 127.0.0.1 --port ${expectedPort}`,
          reuseExistingServer: false,
        },
      });
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  },
);
