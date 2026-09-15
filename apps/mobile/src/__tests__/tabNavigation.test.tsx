import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { App } from '../App.js';
import { TabBar, topTabFor } from '../components/TabBar.js';
import { MoreScreen } from '../features/more/MoreScreen.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';

const snapshot: ContentSnapshot = {
  updates: [],
  projects: [],
  events: [
    {
      documentId: 'event-1',
      title: 'Residents meeting',
      slug: 'residents-meeting',
      summary: 'A confirmed meeting.',
      startsAt: '2026-10-01T18:00:00.000Z',
      endsAt: '2026-10-01T19:00:00.000Z',
      location: 'Shankill Library',
      sourceUrl: 'https://example.com/event',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  surveys: [],
  resources: [
    {
      documentId: 'resource-1',
      title: 'Local health service',
      slug: 'local-health-service',
      category: 'Health',
      serviceType: 'Health centre',
      providerType: 'Public service',
      description: 'Nearby health information.',
      outOfHours: true,
      featured: true,
      details: [],
      collectionDates: [],
      displayOrder: 1,
      sourceName: 'HSE',
      sourceUrl: 'https://example.com/health',
      sourceReviewedOn: '2026-09-09',
    },
    {
      documentId: 'resource-2',
      title: 'Village library',
      slug: 'village-library',
      category: 'Education',
      serviceType: 'Library',
      providerType: 'Public service',
      description: 'Books and study space.',
      outOfHours: false,
      featured: false,
      details: [],
      collectionDates: [],
      displayOrder: 2,
      sourceName: 'Council',
      sourceUrl: 'https://example.com/library',
      sourceReviewedOn: '2026-09-09',
    },
  ],
};

test('topTabFor maps every route to its tab', () => {
  expect(topTabFor({ name: 'home' })).toBe('home');
  expect(topTabFor({ name: 'collection', collection: 'updates' })).toBe(
    'updates',
  );
  expect(topTabFor({ name: 'collection', collection: 'events' })).toBe(
    'events',
  );
  expect(topTabFor({ name: 'collection', collection: 'resources' })).toBe(
    'local',
  );
  expect(topTabFor({ name: 'collection', collection: 'projects' })).toBe(
    'more',
  );
  expect(topTabFor({ name: 'collection', collection: 'surveys' })).toBe('more');
  expect(topTabFor({ name: 'help' })).toBe('more');
  expect(topTabFor({ name: 'more' })).toBe('more');
  expect(topTabFor({ name: 'detail', collection: 'events', slug: 'x' })).toBe(
    'events',
  );
  expect(topTabFor({ name: 'detail', collection: 'projects', slug: 'x' })).toBe(
    'more',
  );
});

test('tab bar switches top-level sections with a visible selected state', async () => {
  const navigateTab = vi.fn();
  const { container } = render(
    <TabBar route={{ name: 'home' }} navigateTab={navigateTab} />,
  );

  expect(
    container.querySelector('[accessibility-label="Home, selected"]'),
  ).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Events'));
  expect(navigateTab).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'events',
  });
});

test('more screen opens projects, consultations, and ways to help', async () => {
  const navigate = vi.fn();
  render(<MoreScreen navigate={navigate} />);

  fireEvent.tap(await screen.findByText('Projects'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'projects',
  });
  fireEvent.tap(screen.getByText('Consultations'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'surveys',
  });
  fireEvent.tap(screen.getByText('Ways to help'));
  expect(navigate).toHaveBeenCalledWith({ name: 'help' });
});

test('back returns through visited screens instead of a fixed parent', async () => {
  render(<App loadContent={() => Promise.resolve(snapshot)} />);
  expect(
    await screen.findByText('What would you like to do?'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Events'));
  fireEvent.tap(await screen.findByText('Residents meeting'));
  expect(await screen.findByText('Shankill Library')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Back to events'));
  expect(await screen.findByText('Meet and take part')).toBeInTheDocument();
});

test('local information keeps its filters when returning from a contact', async () => {
  const { container } = render(
    <App loadContent={() => Promise.resolve(snapshot)} />,
  );
  expect(
    await screen.findByText('What would you like to do?'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Local'));
  expect(await screen.findByText('2 contacts')).toBeInTheDocument();

  fireEvent.tap(screen.getAllByText('Health')[0]!);
  expect(await screen.findByText('1 contact')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Local health service'));
  expect(
    await screen.findByText('Nearby health information.'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Back to local information'));
  expect(await screen.findByText('1 contact')).toBeInTheDocument();
  expect(
    container.querySelector('[accessibility-label="Health, selected"]'),
  ).toBeInTheDocument();
});
