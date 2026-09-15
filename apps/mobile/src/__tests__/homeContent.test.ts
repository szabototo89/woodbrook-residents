import { expect, test } from 'vitest';

import type { ContentSnapshot } from '../features/content/contentTypes.js';
import {
  browseTargets,
  latestUpdate,
  openConsultation,
  upcomingEvent,
} from '../features/home/homeContent.js';

const content: ContentSnapshot = {
  updates: [
    {
      documentId: 'u',
      title: 'Update',
      slug: 'update',
      kind: 'Planning',
      summary: 'Summary',
      body: 'Body',
      publishedOn: '2026-09-01',
      sourceName: 'Source',
      sourceUrl: 'https://example.com/u',
      sourceReviewedOn: '2026-09-02',
      featured: false,
    },
  ],
  projects: [],
  events: [
    {
      documentId: 'e',
      title: 'Event',
      slug: 'event',
      summary: 'Summary',
      startsAt: '2026-10-01T18:00:00.000Z',
      location: 'Woodbrook',
      sourceUrl: 'https://example.com/e',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  surveys: [
    {
      documentId: 's-open',
      title: 'Open survey',
      slug: 'open-survey',
      stage: 'Open',
      summary: 'Summary',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/s',
      sourceReviewedOn: '2026-09-10',
    },
    {
      documentId: 's-closed',
      title: 'Closed survey',
      slug: 'closed-survey',
      stage: 'Closed',
      summary: 'Summary',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/c',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  resources: [],
};

test('home selectors surface the latest update, next event, and open consultation', () => {
  expect(latestUpdate(content)?.slug).toBe('update');
  expect(upcomingEvent(content)?.slug).toBe('event');
  expect(openConsultation(content)?.slug).toBe('open-survey');
  expect(
    openConsultation({ ...content, surveys: [content.surveys[1]!] }),
  ).toBeUndefined();
  expect(latestUpdate({ ...content, updates: [] })).toBeUndefined();
  expect(upcomingEvent({ ...content, events: [] })).toBeUndefined();
});

test('home browse targets cover every section without adding features', () => {
  expect(browseTargets.map((target) => target.title)).toEqual([
    'Updates',
    'Projects',
    'Events',
    'Consultations',
    'Local information',
  ]);
  expect(browseTargets.every((target) => target.description.length > 0)).toBe(
    true,
  );
});
