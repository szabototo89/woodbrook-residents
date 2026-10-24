import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test } from 'vitest';

import { App } from '../App.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';

const snapshot: ContentSnapshot = {
  siteSetting: {
    name: 'Woodbrook Residents',
    location: 'Shankill',
    tagline: 'Local information',
    introduction: 'Welcome',
    contactEmail: 'hello@example.com',
  },
  updates: [],
  projects: [],
  events: [
    {
      documentId: 'event-1',
      title: 'Residents meeting',
      slug: 'residents-meeting',
      summary: 'A confirmed meeting.',
      startsAt: '2026-10-01T18:00:00.000Z',
      location: 'Shankill Library',
      bookingUrl: 'https://example.com/book',
      sourceUrl: 'https://example.com/event',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  surveys: [],
  resources: [],
};

test('booking tap falls back to an in-app view when external open is unavailable', async () => {
  const { container } = render(
    <App loadContent={() => Promise.resolve(snapshot)} openUrl={() => false} />,
  );

  fireEvent.tap(await screen.findByText('Residents meeting'));
  fireEvent.tap(await screen.findByText('Book on the organiser site'));

  const matches = await screen.findAllByText('https://example.com/book');
  expect(matches.length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('Official link')).toBeInTheDocument();
  expect(screen.getByText('Back')).toBeInTheDocument();
  const webview = container.querySelector('webview.external-view');
  expect(webview?.getAttribute('src')).toBe('https://example.com/book');

  fireEvent.tap(screen.getByText('Back'));
  expect(
    await screen.findByText('Book on the organiser site'),
  ).toBeInTheDocument();
});
