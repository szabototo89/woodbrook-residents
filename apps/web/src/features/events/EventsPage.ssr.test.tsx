import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';

vi.mock('../../routes/events/index', () => ({
  Route: {
    useLoaderData: () => ({
      availability: 'ready',
      items: [
        {
          documentId: 'e1',
          title: 'Test event',
          slug: 'test-event',
          summary: 'Summary',
          startsAt: '2026-09-20T10:00:00.000Z',
          location: 'Shankill',
          sourceUrl: 'https://example.com',
          sourceReviewedOn: '2026-09-10',
          featured: false,
        },
      ],
    }),
  },
}));

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: ({ children }: any) => <span>{children}</span>,
  };
});

test('events page renders the timeline during SSR', async () => {
  const { EventsPage } = await import('./EventsPage');
  const markup = renderToStaticMarkup(createElement(EventsPage));
  expect(markup).toContain('Events by date');
});
