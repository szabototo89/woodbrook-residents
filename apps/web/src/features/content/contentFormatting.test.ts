import { describe, expect, it } from 'vitest';

import { formatDate, formatLabel } from './contentFormatting';

describe('content formatting', () => {
  it('formats source dates for Irish readers', () => {
    expect(formatDate('2026-09-05')).toBe('5 September 2026');
  });

  it('turns CMS enum values into readable labels', () => {
    expect(formatLabel('roads-paths')).toBe('Roads Paths');
  });
});
