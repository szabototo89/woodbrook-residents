import { expect, test } from 'vitest';

import {
  CLARITY_TAG_URL,
  createClaritySnippet,
  resolveClarityProjectId,
} from './ClarityAnalytics';

test('Microsoft Clarity project ID returns the configured project ID', () => {
  expect(
    resolveClarityProjectId({ VITE_CLARITY_PROJECT_ID: 'ygta0xvxf6' }),
  ).toBe('ygta0xvxf6');
});

test('Microsoft Clarity project ID ignores a missing or blank project ID so no snippet is emitted', () => {
  expect(resolveClarityProjectId({})).toBeUndefined();
  expect(
    resolveClarityProjectId({ VITE_CLARITY_PROJECT_ID: '  ' }),
  ).toBeUndefined();
});

test('Microsoft Clarity project ID builds a snippet that loads the tag for that project', () => {
  const snippet = createClaritySnippet('ygta0xvxf6');
  expect(snippet).toContain(CLARITY_TAG_URL);
  expect(snippet).toContain('ygta0xvxf6');
});
