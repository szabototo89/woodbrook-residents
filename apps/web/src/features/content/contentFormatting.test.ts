import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime, formatLabel } from './contentFormatting';

describe('content formatting', () => {
  it('formats source dates for Irish readers', () => {
    expect(formatDate('2026-09-05')).toBe('5 September 2026');
  });

  it('formats event date-times with Dublin local time', () => {
    expect(formatDateTime('2026-09-05T10:00:00.000Z')).toBe(
      '5 September 2026 at 11:00',
    );
  });

  it('turns CMS enum values into readable labels', () => {
    expect(formatLabel('roads-paths')).toBe('Roads Paths');
  });
});
