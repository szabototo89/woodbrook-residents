import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { AppHeader } from '../components/AppHeader.js';
import { TabBar } from '../components/TabBar.js';
import { CollectionScreen } from '../features/content/CollectionScreen.js';
import { DetailScreen } from '../features/content/DetailScreen.js';
import { LocalInfoScreen } from '../features/content/LocalInfoScreen.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';
import { HomeScreen } from '../features/home/HomeScreen.js';

const baseContent: ContentSnapshot = {
  updates: [
    {
      documentId: 'u1',
      title: 'Bus route update',
      slug: 'bus-route-update',
      kind: 'Transport',
      summary: 'The route has changed.',
      body: 'Body',
      publishedOn: '2026-09-01',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/u',
      sourceReviewedOn: '2026-09-10',
      featured: true,
    },
  ],
  projects: [],
  events: [
    {
      documentId: 'e1',
      title: 'Residents meeting',
      slug: 'residents-meeting',
      summary: 'A confirmed meeting.',
      startsAt: '2026-10-01T19:00:00.000Z',
      endsAt: '2026-10-01T20:00:00.000Z',
      location: 'Shankill Library',
      sourceUrl: 'https://example.com/e',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  surveys: [
    {
      documentId: 's1',
      title: 'Transport consultation',
      slug: 'transport-consultation',
      stage: 'Open',
      summary: 'Have your say.',
      opensOn: '2026-09-01',
      closesOn: '2026-10-15',
      responseUrl: 'https://example.com/respond',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/s',
      sourceReviewedOn: '2026-09-10',
    },
  ],
  resources: [
    {
      documentId: 'r1',
      title: 'Local health service',
      slug: 'local-health-service',
      category: 'Health',
      serviceType: 'Health centre',
      providerType: 'Public service',
      description: 'Out-of-hours support',
      outOfHours: true,
      featured: true,
      details: [],
      collectionDates: [],
      displayOrder: 1,
      sourceName: 'HSE',
      sourceUrl: 'https://example.com/health',
      sourceReviewedOn: '2026-09-09',
    },
  ],
};

test('home matches reference alignment: hero card, upcoming card, quick grid', async () => {
  const { container } = render(
    <HomeScreen content={baseContent} navigate={() => undefined} />,
  );

  expect(await screen.findByText('Bus route update')).toBeInTheDocument();
  // Hero carousel card with pill + pager dots, single shared gutter.
  expect(container.querySelector('.hero-card')).toBeInTheDocument();
  expect(container.querySelector('.hero-pill')).toBeInTheDocument();
  expect(screen.getByText('Latest update')).toBeInTheDocument();
  expect(container.querySelector('.hero-dots')).toBeInTheDocument();
  expect(container.querySelectorAll('.hero-dot').length).toBeGreaterThanOrEqual(
    3,
  );

  // Upcoming event section header alignment.
  expect(screen.getByText('Upcoming event')).toBeInTheDocument();
  expect(screen.getByText('See all →')).toBeInTheDocument();
  expect(container.querySelector('.upcoming-card')).toBeInTheDocument();
  expect(screen.getByText('Shankill Library')).toBeInTheDocument();

  // Quick access 2x2 grid alignment.
  expect(screen.getByText('Quick access')).toBeInTheDocument();
  expect(container.querySelector('.quick-grid')).toBeInTheDocument();
  expect(screen.getAllByText('Updates').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Events').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Local').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('More')).toBeInTheDocument();
});

test('updates collection matches reference: chips + thumbnail rows', async () => {
  const { container } = render(
    <CollectionScreen
      collection="updates"
      model={{
        eyebrow: 'Stay informed',
        title: 'Updates',
        intro: 'Clear, source-linked notes.',
        empty: 'No updates.',
        cards: [
          {
            slug: 'bus-route-update',
            title: 'Bus route update',
            summary: 'The route has changed.',
            meta: 'Transport · 1 Sept 2026',
          },
        ],
      }}
      navigate={() => undefined}
    />,
  );

  expect(await screen.findByText('Updates')).toBeInTheDocument();
  expect(container.querySelector('.filter-row')).toBeInTheDocument();
  expect(container.querySelector('.thumb-row')).toBeInTheDocument();
  expect(container.querySelector('.thumb')).toBeInTheDocument();
  expect(container.querySelector('.chevron-circle')).toBeInTheDocument();
});

test('events collection matches reference: segmented + date badge cards', async () => {
  const { container } = render(
    <CollectionScreen
      collection="events"
      model={{
        eyebrow: 'Meet and take part',
        title: 'Events',
        intro: 'Confirmed local dates.',
        empty: 'No events.',
        cards: [
          {
            slug: 'residents-meeting',
            title: 'Residents meeting',
            summary: 'A confirmed meeting.',
            meta: '1 Oct 2026 · Shankill Library',
          },
        ],
      }}
      navigate={() => undefined}
    />,
  );

  expect(await screen.findByText('Events')).toBeInTheDocument();
  expect(container.querySelector('.segmented')).toBeInTheDocument();
  expect(screen.getByText('Upcoming')).toBeInTheDocument();
  expect(screen.getByText('Past')).toBeInTheDocument();
  expect(container.querySelector('.event-card')).toBeInTheDocument();
  expect(container.querySelector('.date-badge')).toBeInTheDocument();
});

test('local information matches reference: search + icon rows', async () => {
  const { container } = render(
    <LocalInfoScreen
      content={baseContent}
      navigate={() => undefined}
      filters={{ query: '', category: 'all', outOfHoursOnly: false }}
      onFiltersChange={() => undefined}
    />,
  );

  expect(await screen.findByText('Local information')).toBeInTheDocument();
  expect(container.querySelector('.search-wrap')).toBeInTheDocument();
  expect(container.querySelector('.filter-row')).toBeInTheDocument();
  expect(container.querySelector('.service-row')).toBeInTheDocument();
  expect(container.querySelector('.service-icon')).toBeInTheDocument();
  expect(screen.getByText('Local health service')).toBeInTheDocument();
});

test('consultation detail matches reference: back link, pill, facts, actions', async () => {
  const { container } = render(
    <DetailScreen
      collection="surveys"
      model={{
        backLabel: 'Back to consultations',
        eyebrow: 'Open',
        title: 'Transport consultation',
        summary: 'Have your say.',
        facts: [
          { label: 'Opens', value: '1 Sept 2026' },
          { label: 'Closes', value: '15 Oct 2026' },
        ],
        paragraphs: [],
        sourceName: 'Council',
        sourceUrl: 'https://example.com/s',
        reviewedOn: '10 Sept 2026',
        action: {
          label: 'Respond on the official site',
          url: 'https://example.com/respond',
        },
      }}
      goBack={() => undefined}
    />,
  );

  expect(await screen.findByText('Transport consultation')).toBeInTheDocument();
  expect(container.querySelector('.status-pill')).toBeInTheDocument();
  expect(screen.getByText('Opens')).toBeInTheDocument();
  expect(screen.getByText('Closes')).toBeInTheDocument();
  expect(container.querySelector('.primary-action')).toBeInTheDocument();
  expect(container.querySelector('.source-note')).toBeInTheDocument();
  expect(container.querySelector('.fact-row')).toBeInTheDocument();
});

test('chrome matches reference: header bell + tab pill selected state', async () => {
  const header = render(<AppHeader navigate={vi.fn()} />);
  expect(header.container.querySelector('.header-bell')).toBeInTheDocument();

  const tabs = render(
    <TabBar route={{ name: 'home' }} navigateTab={vi.fn()} />,
  );
  expect(tabs.container.querySelector('.tab-pill')).toBeInTheDocument();
  fireEvent.tap(tabs.getByText('Events'));
});
