import { expect, test } from 'bun:test';

import { buildDeployEnvironment } from './deploy';

test('deploy defaults to Sanity with the production public URL', () => {
  for (const CONTENT_SOURCE of [undefined, '', '   ']) {
    expect(buildDeployEnvironment({ CONTENT_SOURCE })).toMatchObject({
      CONTENT_SOURCE: 'sanity',
      VITE_PUBLIC_SITE_URL: 'https://woodbrook.shankill.workers.dev',
    });
  }
});

test('deploy preserves explicit Sanity configuration', () => {
  expect(
    buildDeployEnvironment({
      CONTENT_SOURCE: ' sanity ',
      SANITY_DATASET: 'preview',
    }),
  ).toMatchObject({ CONTENT_SOURCE: 'sanity', SANITY_DATASET: 'preview' });
});

test('deploy rejects the retired Sheets source', () => {
  expect(() =>
    buildDeployEnvironment({ CONTENT_SOURCE: 'google-sheets' }),
  ).toThrow('CONTENT_SOURCE must be');
});

test('deploy rejects an unsupported source before building or publishing', () => {
  expect(() =>
    buildDeployEnvironment({ CONTENT_SOURCE: 'filesystem' }),
  ).toThrow('CONTENT_SOURCE must be');
});
