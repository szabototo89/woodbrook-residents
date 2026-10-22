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

test('deploy preserves an explicit content source and its credentials', () => {
  expect(
    buildDeployEnvironment({
      CONTENT_SOURCE: ' google-sheets ',
      GOOGLE_SERVICE_ACCOUNT_EMAIL: 'reader@example.test',
    }),
  ).toMatchObject({
    CONTENT_SOURCE: 'google-sheets',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'reader@example.test',
  });
  expect(
    buildDeployEnvironment({
      CONTENT_SOURCE: 'sanity',
      SANITY_DATASET: 'preview',
    }).SANITY_DATASET,
  ).toBe('preview');
});

test('deploy rejects an unsupported source before building or publishing', () => {
  expect(() =>
    buildDeployEnvironment({ CONTENT_SOURCE: 'filesystem' }),
  ).toThrow('CONTENT_SOURCE must be');
});
