import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { App } from '../App.js';
import { HomeScreen } from '../features/home/HomeScreen.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';

const content: ContentSnapshot = {
  updates: [
    {
      documentId: 'u',
      title: 'Bus route update',
      slug: 'bus-route-update',
      kind: 'Transport',
      summary: 'The route has changed.',
      body: 'Body',
      publishedOn: '2026-09-01',
      sourceName: 'Source',
      sourceUrl: 'https://example.com/u',
      sourceReviewedOn: '2026-09-02',
      featured: true,
    },
  ],
  projects: [],
  events: [
    {
      documentId: 'e',
      title: 'Residents meeting',
      slug: 'residents-meeting',
      summary: 'A confirmed meeting.',
      startsAt: '2026-10-01T18:00:00.000Z',
      location: 'Shankill Library',
      sourceUrl: 'https://example.com/e',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  surveys: [
    {
      documentId: 's',
      title: 'Transport consultation',
      slug: 'transport-consultation',
      stage: 'Open',
      summary: 'Have your say.',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/s',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  resources: [],
};

test('app renders the Woodbrook home screen', async () => {
  render(
    <App
      loadContent={() =>
        Promise.resolve({
          updates: [],
          projects: [],
          events: [],
          surveys: [],
          resources: [],
        })
      }
    />,
  );

  expect(await screen.findByText('Browse all sections')).toBeInTheDocument();
  expect(screen.getByText('Community hub · Shankill')).toBeInTheDocument();
});

test('home screen preserves Woodbrook identity and purpose', async () => {
  render(<HomeScreen content={content} />);

  expect(await screen.findByText('Woodbrook Residents')).toBeInTheDocument();
  expect(
    screen.getByText('Local information and ways to take part.'),
  ).toBeInTheDocument();
});

test('home screen surfaces live content and browses every section', async () => {
  const navigate = vi.fn();
  render(<HomeScreen content={content} navigate={navigate} />);

  expect(await screen.findByText('Latest')).toBeInTheDocument();
  expect(screen.getByText('Bus route update')).toBeInTheDocument();
  expect(screen.getByText('Upcoming')).toBeInTheDocument();
  expect(screen.getByText('Have your say')).toBeInTheDocument();
  expect(screen.getByText('Find nearby essentials')).toBeInTheDocument();
  expect(
    screen.getByText('Help keep local information useful.'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Bus route update'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'detail',
    collection: 'updates',
    slug: 'bus-route-update',
  });
  fireEvent.tap(screen.getByText('Residents meeting'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'detail',
    collection: 'events',
    slug: 'residents-meeting',
  });
  fireEvent.tap(screen.getByText('Transport consultation'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'detail',
    collection: 'surveys',
    slug: 'transport-consultation',
  });
  fireEvent.tap(screen.getByText('Find nearby essentials'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'resources',
  });
  fireEvent.tap(screen.getByText('Projects'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'projects',
  });
  fireEvent.tap(screen.getByText('See ways to help →'));
  expect(navigate).toHaveBeenCalledWith({ name: 'help' });
});

test('home screen stays useful with empty sections', async () => {
  render(
    <HomeScreen
      content={{
        updates: [],
        projects: [],
        events: [],
        surveys: [],
        resources: [],
      }}
    />,
  );

  expect(await screen.findByText('Browse all sections')).toBeInTheDocument();
  expect(screen.queryByText('Latest')).not.toBeInTheDocument();
  expect(screen.queryByText('Upcoming')).not.toBeInTheDocument();
  expect(screen.getByText('Find nearby essentials')).toBeInTheDocument();
});

test('home screen remains safe when rendered without a navigator', async () => {
  render(<HomeScreen content={content} />);
  fireEvent.tap(await screen.findByText('Bus route update'));
});

test('home screen identifies its source-backed Woodbrook image', async () => {
  const { container } = render(<HomeScreen content={content} />);

  expect(
    await screen.findByText('Woodbrook and the Shankill coastline'),
  ).toBeInTheDocument();
  expect(
    screen.queryByText('Image: Woodbrook Shankill'),
  ).not.toBeInTheDocument();
  expect(
    container.querySelector(
      '[accessibility-label="Aerial view across Woodbrook toward the coast, Bray and the Wicklow Mountains"]',
    ),
  ).toBeInTheDocument();
});

test('home cards show tap affordances and view-all links', async () => {
  const navigate = vi.fn();
  render(<HomeScreen content={content} navigate={navigate} />);

  expect(await screen.findByText('Bus route update')).toBeInTheDocument();
  expect(screen.getAllByText('›').length).toBeGreaterThanOrEqual(3);
  expect(screen.getByText('View all updates →')).toBeInTheDocument();
  expect(screen.getByText('View all events →')).toBeInTheDocument();
  expect(screen.getByText('View all consultations →')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('View all updates →'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'updates',
  });
});
