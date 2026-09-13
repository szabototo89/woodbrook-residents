import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { App } from '../App.js';
import { DetailScreen } from '../features/content/DetailScreen.js';
import { LocalInfoScreen } from '../features/content/LocalInfoScreen.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';

const snapshot: ContentSnapshot = {
  siteSetting: {
    name: 'Woodbrook Residents',
    location: 'Shankill',
    tagline: 'Local information',
    introduction: 'Welcome',
    contactEmail: 'hello@example.com',
  },
  updates: [
    {
      documentId: 'update-1',
      title: 'Bus route update',
      slug: 'bus-route-update',
      kind: 'Transport',
      summary: 'The route has changed.',
      body: 'First paragraph.\n\nSecond paragraph.',
      publishedOn: '2026-09-01',
      sourceName: 'Official transport source',
      sourceUrl: 'https://example.com/update',
      sourceReviewedOn: '2026-09-02',
      featured: true,
    },
  ],
  projects: [
    {
      documentId: 'project-1',
      title: 'Green space project',
      slug: 'green-space',
      category: 'Public realm',
      stage: 'Active',
      summary: 'Work is under way.',
      details: 'Project details.',
      updatedOn: '2026-08-20',
      nextStep: 'Review the next update.',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/project',
      sourceReviewedOn: '2026-08-21',
      featured: true,
    },
  ],
  events: [
    {
      documentId: 'event-1',
      title: 'Residents meeting',
      slug: 'residents-meeting',
      summary: 'A confirmed meeting.',
      startsAt: '2026-10-01T18:00:00.000Z',
      endsAt: '2026-10-01T19:00:00.000Z',
      location: 'Shankill Library',
      bookingUrl: 'https://example.com/book',
      sourceUrl: 'https://example.com/event',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  surveys: [
    {
      documentId: 'survey-1',
      title: 'Transport consultation',
      slug: 'transport-consultation',
      stage: 'Open',
      summary: 'Have your say.',
      opensOn: '2026-09-01',
      closesOn: '2026-10-15',
      responseUrl: 'https://example.com/respond',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/survey',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  resources: [
    {
      documentId: 'resource-1',
      title: 'Local health service',
      slug: 'local-health-service',
      category: 'Health',
      serviceType: 'Health centre',
      providerType: 'Public service',
      description: 'Nearby health information.',
      phone: '012345678',
      outOfHours: true,
      featured: true,
      details: [
        { id: 1, label: 'Hours', value: 'Monday–Friday', showOnCard: true },
      ],
      collectionDates: [],
      displayOrder: 1,
      sourceName: 'HSE',
      sourceUrl: 'https://example.com/health',
      sourceReviewedOn: '2026-09-09',
    },
  ],
};

test('app loads runtime content and navigates through every resident section', async () => {
  const loadContent = vi.fn().mockResolvedValue(snapshot);
  render(<App loadContent={loadContent} />);

  expect(
    await screen.findByText('What would you like to do?'),
  ).toBeInTheDocument();
  expect(loadContent).toHaveBeenCalledOnce();

  fireEvent.tap(screen.getByText('Projects'));
  expect(await screen.findByText('Follow local change')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Green space project'));
  expect(await screen.findByText('Project details.')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Back to projects'));

  fireEvent.tap(screen.getByText('Events'));
  expect(await screen.findByText('Meet and take part')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Residents meeting'));
  expect(await screen.findByText('Shankill Library')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Consultations'));
  expect(await screen.findByText('Have your say')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Transport consultation'));
  expect(
    await screen.findByText('Respond on the official site'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Local information'));
  expect(await screen.findByText('Useful nearby')).toBeInTheDocument();
  expect(screen.getByText('1 contact')).toBeInTheDocument();
  fireEvent.tap(screen.getAllByText('Health')[0]!);
  fireEvent.tap(screen.getByText('Out-of-hours only'));
  expect(screen.getByText('1 contact')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Local health service'));
  expect(await screen.findByText('Monday–Friday')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Updates'));
  expect(await screen.findByText('Stay informed')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Bus route update'));
  expect(await screen.findByText('Second paragraph.')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Ways to help'));
  expect(
    await screen.findByText('How residents can contribute'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Woodbrook Residents'));
  expect(
    await screen.findByText('What would you like to do?'),
  ).toBeInTheDocument();
});

test('collection and detail screens explain empty or missing content', async () => {
  const empty = { ...snapshot, updates: [] };
  render(<App loadContent={() => Promise.resolve(empty)} />);
  await screen.findByText('What would you like to do?');
  fireEvent.tap(screen.getByText('Updates'));
  expect(
    await screen.findByText('No updates are available right now.'),
  ).toBeInTheDocument();
});

test('app shows runtime loading and failure states with retry', async () => {
  const loadContent = vi
    .fn()
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(snapshot);
  render(<App loadContent={loadContent} />);

  expect(
    await screen.findByText('Content is temporarily unavailable.'),
  ).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Try again'));

  await waitFor(() => expect(loadContent).toHaveBeenCalledTimes(2));
  expect(
    await screen.findByText('What would you like to do?'),
  ).toBeInTheDocument();
});

test('local information shows no-match and empty-directory states', async () => {
  const navigate = vi.fn();
  const { unmount } = render(
    <LocalInfoScreen
      content={{
        ...snapshot,
        resources: snapshot.resources.map((resource) => ({
          ...resource,
          outOfHours: false,
        })),
      }}
      navigate={navigate}
    />,
  );

  fireEvent.tap(screen.getByText('Out-of-hours only'));
  expect(await screen.findByText('No matching contacts')).toBeInTheDocument();
  unmount();

  render(
    <LocalInfoScreen
      content={{ ...snapshot, resources: [] }}
      navigate={navigate}
    />,
  );
  expect(
    await screen.findByText('No local information is available right now.'),
  ).toBeInTheDocument();
});

test('missing detail state returns to its collection', async () => {
  const navigate = vi.fn();
  render(
    <DetailScreen collection="events" model={undefined} navigate={navigate} />,
  );

  fireEvent.tap(await screen.findByText('Back'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'events',
  });
});
