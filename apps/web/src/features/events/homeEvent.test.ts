import { expect, test } from 'vitest';

import type { CommunityEvent } from '../content/contentTypes';
import { selectHomeEvent } from './homeEvent';

function event(
  documentId: string,
  startsAt: string,
  featured = false,
): CommunityEvent {
  return {
    documentId,
    title: `Event ${documentId}`,
    slug: `event-${documentId}`,
    summary: 'A source-backed local event.',
    startsAt,
    location: 'Shankill',
    sourceUrl: 'https://example.com/event',
    sourceReviewedOn: '2026-09-10',
    featured,
  };
}

const NOW = '2026-09-18T12:00:00.000Z';

test('home event never shows past events', () => {
  const selected = selectHomeEvent(
    [event('past', '2026-09-12T18:00:00.000Z')],
    NOW,
  );

  expect(selected).toBeUndefined();
});

test('home event shows the next upcoming event when nothing is featured', () => {
  const selected = selectHomeEvent(
    [
      event('later', '2026-09-25T18:00:00.000Z'),
      event('next', '2026-09-20T18:00:00.000Z'),
      event('past', '2026-09-12T18:00:00.000Z'),
    ],
    NOW,
  );

  expect(selected?.documentId).toBe('next');
});

test('home event prefers the next future featured event', () => {
  const selected = selectHomeEvent(
    [
      event('sooner', '2026-09-19T18:00:00.000Z', false),
      event('featured-later', '2026-09-25T18:00:00.000Z', true),
      event('featured-next', '2026-09-20T18:00:00.000Z', true),
    ],
    NOW,
  );

  expect(selected?.documentId).toBe('featured-next');
});

test('home event ignores featured events in the past', () => {
  const selected = selectHomeEvent(
    [
      event('featured-past', '2026-09-12T18:00:00.000Z', true),
      event('next', '2026-09-20T18:00:00.000Z', false),
    ],
    NOW,
  );

  expect(selected?.documentId).toBe('next');
});

test('home event handles no future events gracefully', () => {
  expect(selectHomeEvent([], NOW)).toBeUndefined();
  expect(
    selectHomeEvent([event('past', '2026-09-01T18:00:00.000Z')], NOW),
  ).toBeUndefined();
});
