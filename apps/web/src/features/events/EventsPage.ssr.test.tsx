import { createElement } from 'react';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';

import type { ContentCollection } from '../content/contentTypes';
import type { CommunityEvent } from '../content/contentTypes';

const readyEvent: CommunityEvent = {
  documentId: 'e1',
  title: 'Test event',
  slug: 'test-event',
  summary: 'Summary',
  startsAt: '2026-09-20T10:00:00.000Z',
  location: 'Shankill',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
  featured: false,
};

let mockContent: ContentCollection<CommunityEvent> = {
  availability: 'ready',
  items: [readyEvent],
};

vi.mock('../../routes/events/index', () => ({
  Route: {
    useLoaderData: () => mockContent,
  },
}));

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  };
});

test('events page renders the timeline during SSR', async () => {
  mockContent = { availability: 'ready', items: [readyEvent] };
  const { EventsPage } = await import('./EventsPage');
  const markup = renderToStaticMarkup(createElement(EventsPage));
  expect(markup).toContain('Events by date');
});

test('events page explains an empty calendar', async () => {
  mockContent = { availability: 'ready', items: [] };
  const { EventsPage } = await import('./EventsPage');
  const markup = renderToStaticMarkup(createElement(EventsPage));
  expect(markup).toContain('No upcoming events published');
});

test('events page explains a content outage', async () => {
  mockContent = { availability: 'unavailable', items: [] };
  const { EventsPage } = await import('./EventsPage');
  const markup = renderToStaticMarkup(createElement(EventsPage));
  expect(markup).toContain('temporarily unavailable');
});
