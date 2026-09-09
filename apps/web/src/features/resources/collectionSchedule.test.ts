import { describe, expect, it } from 'vitest';

import type { CollectionDate } from './collectionScheduleUtils';
import {
  getDublinCalendarDate,
  getNextCollectionDates,
} from './collectionScheduleUtils';

const dates: CollectionDate[] = [
  { id: 1, date: '2026-09-08', stream: 'waste-compost' },
  { id: 2, date: '2026-09-15', stream: 'recycling' },
  { id: 3, date: '2026-09-22', stream: 'waste-compost' },
  { id: 4, date: '2026-09-29', stream: 'recycling' },
];

describe('collection schedule', () => {
  it('finds the next date for each collection stream', () => {
    expect(getNextCollectionDates(dates, '2026-09-09')).toEqual([
      { stream: 'recycling', date: '2026-09-15' },
      { stream: 'waste-compost', date: '2026-09-22' },
    ]);
  });

  it('includes a collection happening today', () => {
    expect(getNextCollectionDates(dates, '2026-09-08')[1]).toEqual({
      stream: 'waste-compost',
      date: '2026-09-08',
    });
  });

  it('uses the Dublin calendar date around a UTC day boundary', () => {
    expect(getDublinCalendarDate(new Date('2026-06-01T23:30:00Z'))).toBe(
      '2026-06-02',
    );
  });
});
