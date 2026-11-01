import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';
import { AppHeader } from '../components/AppHeader.js';
import { CardFeed } from '../features/content/CardFeed.js';
import { DetailScreen } from '../features/content/DetailScreen.js';
import { HomeScreen } from '../features/home/HomeScreen.js';
const contentFixture = {
  updates: [],
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

test('the home introduction leads into shortcuts then source-linked news', async () => {
  const navigate = vi.fn();
  const { container } = render(
    <HomeScreen
      content={{
        ...contentFixture,
        updates: [
          {
            documentId: 'u',
            slug: 'sample-news',
            title: 'Sample news',
            kind: 'Community',
            summary: 'Sample summary.',
            body: 'Sample body.',
            publishedOn: '2026-10-01',
            sourceName: 'Sample source',
            sourceUrl: 'https://example.com/news',
            sourceReviewedOn: '2026-10-01',
            featured: true,
          },
        ],
      }}
      navigate={navigate}
    />,
  );
  expect(
    await screen.findByText('Find what’s happening in Woodbrook, fast.'),
  ).toBeInTheDocument();
  expect(screen.getByText('Shankill, Dublin')).toBeInTheDocument();
  const text = container.textContent ?? '';
  expect(text.indexOf('Quick access')).toBeLessThan(
    text.indexOf('What’s new in Woodbrook'),
  );
  expect(container.querySelector('.hero-dots')).not.toBeInTheDocument();
  fireEvent.tap(screen.getByText('Sample news'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'detail',
    collection: 'updates',
    slug: 'sample-news',
  });
});

test('the shared brand uses the website symbol and home destination', async () => {
  const navigate = vi.fn();
  const { container } = render(<AppHeader navigate={navigate} />);
  expect(container.querySelector('image.brand-mark')).toBeInTheDocument();
  expect(screen.queryByText('W')).not.toBeInTheDocument();
  expect(await screen.findByText('Community Hub')).toBeInTheDocument();
  fireEvent.tap(
    container.querySelector(
      '[accessibility-label="Woodbrook Residents home"]',
    )!,
  );
  expect(navigate).toHaveBeenCalledWith({ name: 'home' });
});

test('records without editorial imagery do not borrow the coastal hero photo', async () => {
  const { container } = render(
    <CardFeed
      variant="events"
      cards={[
        {
          slug: 'sample',
          title: 'Sample event',
          summary: 'Sample description.',
          meta: '1 Oct 2026 · Sample location',
        },
      ]}
      actionLabel="Read more"
      emptyLabel=""
      onSelect={vi.fn()}
    />,
  );
  expect(await screen.findByText('Sample event')).toBeInTheDocument();
  expect(container.querySelector('.event-image')).not.toBeInTheDocument();
});

test('a detail without editorial imagery leads directly to facts and sources', async () => {
  const { container } = render(
    <DetailScreen
      collection="events"
      model={{
        backLabel: 'Back to events',
        eyebrow: 'Event',
        title: 'Sample event',
        summary: 'Sample description.',
        facts: [{ label: 'Location', value: 'Sample location' }],
        paragraphs: ['Sample detail.'],
        sourceName: 'Sample source',
        sourceUrl: 'https://example.com/event',
        reviewedOn: '1 Oct 2026',
      }}
      goBack={vi.fn()}
    />,
  );
  expect(await screen.findByText('Sample detail.')).toBeInTheDocument();
  expect(container.querySelector('.detail-hero')).not.toBeInTheDocument();
  expect(screen.getByText('Official source')).toBeInTheDocument();
});

test('news entry points keep their existing collection destination', async () => {
  const navigate = vi.fn();
  const header = render(<AppHeader navigate={navigate} />);
  fireEvent.tap(
    header.container.querySelector('[accessibility-label="View latest news"]')!,
  );
  expect(navigate).toHaveBeenLastCalledWith({
    name: 'collection',
    collection: 'updates',
  });
});

test('event rows retain an accessible record when the date is not supplied', async () => {
  const onSelect = vi.fn();
  render(
    <CardFeed
      variant="events"
      cards={[
        {
          slug: 'sample',
          title: 'Date to confirm',
          summary: 'Check the official source.',
          meta: 'Date to confirm',
        },
      ]}
      actionLabel="Read more"
      emptyLabel=""
      onSelect={onSelect}
    />,
  );
  fireEvent.tap(
    await screen.findByText('Date to confirm', { selector: '.event-title' }),
  );
  expect(onSelect).toHaveBeenCalledWith('sample');
  expect(screen.getByText('DATE')).toBeInTheDocument();
});
