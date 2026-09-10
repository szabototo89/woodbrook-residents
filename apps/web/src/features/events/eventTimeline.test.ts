import { describe, expect, it } from 'vitest';

import type { CommunityEvent } from '../content/contentTypes';
import { groupEventsByTimeline } from './eventTimeline';

function event(documentId: string, startsAt: string): CommunityEvent {
  return {
    documentId,
    title: `Event ${documentId}`,
    slug: `event-${documentId}`,
    summary: 'A source-backed local event.',
    startsAt,
    location: 'Shankill',
    sourceUrl: 'https://example.com/event',
    sourceReviewedOn: '2026-09-10',
  };
}

describe('event timeline', () => {
  it('groups Dublin event dates into this week, next week, and later', () => {
    const groups = groupEventsByTimeline(
      [
        event('thursday', '2026-09-10T18:00:00.000Z'),
        event('next-monday', '2026-09-14T08:00:00.000Z'),
        event('later', '2026-09-28T18:00:00.000Z'),
      ],
      '2026-09-10T12:00:00.000Z',
    );

    expect(
      groups.map(({ id, title, dateRange }) => ({ id, title, dateRange })),
    ).toEqual([
      { id: 'this-week', title: 'This week', dateRange: '7–13 Sept' },
      { id: 'next-week', title: 'Next week', dateRange: '14–20 Sept' },
      { id: 'later', title: 'Later', dateRange: 'From 21 Sept' },
    ]);
    expect(
      groups.map((group) => group.events.map(({ documentId }) => documentId)),
    ).toEqual([['thursday'], ['next-monday'], ['later']]);
  });

  it('uses Monday-based Irish weeks across month boundaries', () => {
    const groups = groupEventsByTimeline(
      [
        event('sunday', '2026-10-04T22:30:00.000Z'),
        event('monday', '2026-10-05T08:00:00.000Z'),
      ],
      '2026-09-30T12:00:00.000Z',
    );

    expect(groups.map((group) => group.dateRange)).toEqual([
      '28 Sept–4 Oct',
      '5–11 Oct',
    ]);
    expect(groups.map((group) => group.events[0].documentId)).toEqual([
      'sunday',
      'monday',
    ]);
  });

  it('omits empty periods while preserving event order', () => {
    const groups = groupEventsByTimeline(
      [
        event('first', '2026-10-17T08:00:00.000Z'),
        event('second', '2026-10-24T08:00:00.000Z'),
      ],
      '2026-09-10T12:00:00.000Z',
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].title).toBe('Later');
    expect(groups[0].events.map(({ documentId }) => documentId)).toEqual([
      'first',
      'second',
    ]);
  });

  it('keeps older published dates clearly separate from upcoming events', () => {
    const groups = groupEventsByTimeline(
      [
        event('older', '2026-08-20T18:00:00.000Z'),
        event('upcoming', '2026-09-12T08:00:00.000Z'),
      ],
      '2026-09-10T12:00:00.000Z',
    );

    expect(
      groups.map(({ id, title, dateRange }) => ({ id, title, dateRange })),
    ).toEqual([
      {
        id: 'this-week',
        title: 'This week',
        dateRange: '7–13 Sept',
      },
      {
        id: 'earlier',
        title: 'Earlier dates',
        dateRange: 'Before 7 Sept',
      },
    ]);
  });
});
