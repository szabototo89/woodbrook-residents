import { describe, expect, it } from 'vitest';

import {
  CLARITY_TAG_URL,
  createClaritySnippet,
  resolveClarityProjectId,
} from './ClarityAnalytics';

describe('Microsoft Clarity project ID', () => {
  it('returns the configured project ID', () => {
    expect(
      resolveClarityProjectId({ VITE_CLARITY_PROJECT_ID: 'ygta0xvxf6' }),
    ).toBe('ygta0xvxf6');
  });

  it('ignores a missing or blank project ID so no snippet is emitted', () => {
    expect(resolveClarityProjectId({})).toBeUndefined();
    expect(
      resolveClarityProjectId({ VITE_CLARITY_PROJECT_ID: '  ' }),
    ).toBeUndefined();
  });

  it('builds a snippet that loads the tag for that project', () => {
    const snippet = createClaritySnippet('ygta0xvxf6');
    expect(snippet).toContain(CLARITY_TAG_URL);
    expect(snippet).toContain('ygta0xvxf6');
  });
});
