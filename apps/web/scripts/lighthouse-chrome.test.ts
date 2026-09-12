import { expect, test } from 'bun:test';

import { lighthouseArgs } from './lighthouse-chrome';

test('lighthouse chrome flags are CI-safe (no-sandbox, shared memory)', () => {
  const args = lighthouseArgs('http://127.0.0.1:4173/', '/tmp/report.json', {
    formFactor: 'mobile',
  });
  const flagsArg = args.find((arg) => arg.startsWith('--chrome-flags='));
  expect(flagsArg).toBeDefined();
  expect(flagsArg).toContain('--headless');
  expect(flagsArg).toContain('--no-sandbox');
  expect(flagsArg).toContain('--disable-gpu');
  expect(flagsArg).toContain('--disable-dev-shm-usage');
});

test('lighthouse passes an explicit chrome path when CHROME_PATH is set', () => {
  const args = lighthouseArgs('http://127.0.0.1:4173/', '/tmp/report.json', {
    chromePath: '/usr/bin/google-chrome',
    formFactor: 'mobile',
  });
  expect(args).toContain('--chrome-path=/usr/bin/google-chrome');
});

test('lighthouse omits chrome-path when no path is provided', () => {
  const args = lighthouseArgs('http://127.0.0.1:4173/', '/tmp/report.json', {
    formFactor: 'desktop',
  });
  expect(args.some((arg) => arg.startsWith('--chrome-path='))).toBe(false);
  expect(args).toContain('--preset=desktop');
});
