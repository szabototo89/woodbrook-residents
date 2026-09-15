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

const defaultFilters = {
  query: '',
  category: 'all',
  outOfHoursOnly: false,
};

test('app loads runtime content and navigates through every resident section', async () => {
  const loadContent = vi.fn().mockResolvedValue(snapshot);
  render(<App loadContent={loadContent} />);

  expect(
    await screen.findByText('Local information and ways to take part.'),
  ).toBeInTheDocument();
  expect(loadContent).toHaveBeenCalledOnce();

  fireEvent.tap(screen.getByText('More'));
  fireEvent.tap(await screen.findByText('Projects'));
  expect(
    await screen.findByText(
      'A simple record of what is proposed, active, completed, or still being monitored — with the latest known next step and an official source.',
    ),
  ).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Green space project'));
  expect(await screen.findByText('Project details.')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Back to projects'));
  expect(
    await screen.findByText(
      'A simple record of what is proposed, active, completed, or still being monitored — with the latest known next step and an official source.',
    ),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Events'));
  expect(
    await screen.findByText(
      'Confirmed local dates from organisers and public bodies. Always check the linked organiser page before travelling.',
    ),
  ).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Residents meeting'));
  expect(await screen.findByText('Shankill Library')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('More'));
  fireEvent.tap(await screen.findByText('Consultations'));
  expect(
    await screen.findByText(
      'Open opportunities to respond, plus a record of relevant closed consultations so important context does not disappear.',
    ),
  ).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Transport consultation'));
  expect(
    await screen.findByText('Respond on the official site'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Local'));
  expect(
    await screen.findByText(
      'Find a curated starting set of nearby public services, community contacts, and businesses—then check the source and contact the provider directly.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByText('1 contact')).toBeInTheDocument();
  fireEvent.tap(screen.getAllByText('Health')[0]!);
  fireEvent.tap(screen.getByText('Out-of-hours only'));
  expect(screen.getByText('1 contact')).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Local health service'));
  expect(await screen.findByText('Monday–Friday')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Updates'));
  expect(
    await screen.findByText(
      'Clear, source-linked notes on transport, planning, public spaces, and the practical changes residents need to know about.',
    ),
  ).toBeInTheDocument();
  fireEvent.tap(screen.getByText('Bus route update'));
  expect(await screen.findByText('Second paragraph.')).toBeInTheDocument();

  fireEvent.tap(screen.getByText('More'));
  fireEvent.tap(await screen.findByText('Ways to help'));
  expect(
    await screen.findByText('How residents can contribute'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Woodbrook Residents'));
  expect(
    await screen.findByText('Local information and ways to take part.'),
  ).toBeInTheDocument();
});

test('collection and detail screens explain empty or missing content', async () => {
  const empty = { ...snapshot, updates: [] };
  const { container } = render(
    <App loadContent={() => Promise.resolve(empty)} />,
  );
  await screen.findByText('Local information and ways to take part.');
  fireEvent.tap(container.querySelector('[accessibility-label="Updates"]')!);
  expect(
    await screen.findByText('No updates are available right now.'),
  ).toBeInTheDocument();
});

test('app stays usable with empty sections when loading fails, then recovers on retry', async () => {
  const loadContent = vi
    .fn()
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(snapshot);
  const { container } = render(<App loadContent={loadContent} />);

  expect(
    await screen.findByText('Local information and ways to take part.'),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Content is temporarily unavailable.'),
  ).toBeInTheDocument();

  fireEvent.tap(container.querySelector('[accessibility-label="Updates"]')!);
  expect(
    await screen.findByText('No updates are available right now.'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Try again'));

  await waitFor(() => expect(loadContent).toHaveBeenCalledTimes(2));
  expect(await screen.findByText('Bus route update')).toBeInTheDocument();
  expect(screen.queryByText('Try again')).not.toBeInTheDocument();
});

test('local information shows no-match and empty-directory states', async () => {
  const navigate = vi.fn();
  const onFiltersChange = vi.fn();
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
      filters={{ ...defaultFilters, outOfHoursOnly: true }}
      onFiltersChange={onFiltersChange}
    />,
  );

  expect(await screen.findByText('No matching contacts')).toBeInTheDocument();
  unmount();

  render(
    <LocalInfoScreen
      content={{ ...snapshot, resources: [] }}
      navigate={navigate}
      filters={defaultFilters}
      onFiltersChange={onFiltersChange}
    />,
  );
  expect(
    await screen.findByText('No local information is available right now.'),
  ).toBeInTheDocument();
});

test('out-of-hours filter sizes to its content instead of stretching', async () => {
  const { container } = render(
    <LocalInfoScreen
      content={snapshot}
      navigate={vi.fn()}
      filters={defaultFilters}
      onFiltersChange={vi.fn()}
    />,
  );

  await screen.findByText('Out-of-hours only');
  const toggle = container.querySelector('.filter-chip-solo');
  expect(toggle).toBeInTheDocument();
  expect(toggle?.textContent).toContain('Out-of-hours only');
});

test('missing detail state returns to its collection', async () => {
  const goBack = vi.fn();
  render(
    <DetailScreen collection="events" model={undefined} goBack={goBack} />,
  );

  fireEvent.tap(await screen.findByText('Back'));
  expect(goBack).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'events',
  });
  expect(
    screen.getByText(
      'It may have been removed or the link is out of date. Try the collection instead.',
    ),
  ).toBeInTheDocument();
});
