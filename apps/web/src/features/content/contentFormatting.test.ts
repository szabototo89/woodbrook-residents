import { expect, test } from 'vitest';

import { formatDate, formatDateTime, formatLabel } from './contentFormatting';

test('content formatting formats source dates for Irish readers', () => {
  expect(formatDate('2026-09-05')).toBe('5 September 2026');
});

test('content formatting formats event date-times with Dublin local time', () => {
  expect(formatDateTime('2026-09-05T10:00:00.000Z')).toBe(
    '5 September 2026 at 11:00',
  );
});

test('content formatting turns CMS enum values into readable labels', () => {
  expect(formatLabel('roads-paths')).toBe('Roads Paths');
});
