import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { DetailScreen } from '../features/content/DetailScreen.js';
import type { DetailModel } from '../features/content/contentModels.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';
import { WaysToHelpScreen } from '../features/help/WaysToHelpScreen.js';

const model: DetailModel = {
  backLabel: 'Back to events',
  eyebrow: '18 Sept 2026, 18:00 · Shankill Library',
  title: 'Residents meeting',
  summary: 'A confirmed meeting.',
  facts: [{ label: 'Location', value: 'Shankill Library' }],
  paragraphs: [],
  sourceName: 'Dún Laoghaire–Rathdown County Council',
  sourceUrl: 'https://www.dlrcoco.ie/en/news',
  reviewedOn: '5 Sept 2026',
  action: {
    label: 'Book on the organiser site',
    url: 'https://example.com/book',
  },
  contact: {
    phone: '012345678',
    email: 'hello@example.com',
    url: 'https://visit.example.org/info',
  },
};

const helpContent: ContentSnapshot = {
  siteSetting: {
    name: 'Woodbrook Residents',
    location: 'Shankill',
    tagline: 'Local information',
    introduction: 'Welcome',
    contactEmail: 'hello@example.com',
  },
  updates: [],
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

test('detail actions open external URLs instead of rendering dead text', async () => {
  const onOpenUrl = vi.fn();
  const goBack = vi.fn();
  render(
    <DetailScreen
      collection="events"
      model={model}
      goBack={goBack}
      onOpenUrl={onOpenUrl}
    />,
  );

  fireEvent.tap(await screen.findByText('Book on the organiser site'));
  expect(onOpenUrl).toHaveBeenCalledWith('https://example.com/book');

  fireEvent.tap(screen.getByText('dlrcoco.ie ↗'));
  expect(onOpenUrl).toHaveBeenCalledWith('https://www.dlrcoco.ie/en/news');
  expect(await screen.findByText('Checked 5 Sept 2026')).toBeInTheDocument();
  expect(screen.queryByText(/Verified/)).not.toBeInTheDocument();

  fireEvent.tap(screen.getByText('Call 012345678'));
  expect(onOpenUrl).toHaveBeenCalledWith('tel:012345678');

  fireEvent.tap(screen.getByText('Email hello@example.com'));
  expect(onOpenUrl).toHaveBeenCalledWith('mailto:hello@example.com');

  fireEvent.tap(screen.getByText('Visit visit.example.org ↗'));
  expect(onOpenUrl).toHaveBeenCalledWith('https://visit.example.org/info');

  fireEvent.tap(screen.getByText('Get directions ↗'));
  expect(onOpenUrl).toHaveBeenCalledWith(
    'https://www.google.com/maps/search/?api=1&query=Shankill%20Library',
  );
});

test('detail back returns to the previous screen', async () => {
  const goBack = vi.fn();
  render(<DetailScreen collection="events" model={model} goBack={goBack} />);

  fireEvent.tap(await screen.findByText('Back to events'));
  expect(goBack).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'events',
  });
});

test('ways to help contacts the community and navigates to live sections', async () => {
  const navigate = vi.fn();
  const onOpenUrl = vi.fn();
  render(
    <WaysToHelpScreen
      content={helpContent}
      navigate={navigate}
      onOpenUrl={onOpenUrl}
    />,
  );

  expect(
    await screen.findByText('Community contributions are coming soon.'),
  ).toBeInTheDocument();
  expect(
    screen.getByText('For now, this is a read-only public resource.'),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/Public submissions are\s*not available yet/),
  ).not.toBeInTheDocument();

  fireEvent.tap(screen.getByText('hello@example.com'));
  expect(onOpenUrl).toHaveBeenCalledWith('mailto:hello@example.com');

  fireEvent.tap(screen.getByText('Check upcoming events'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'events',
  });

  fireEvent.tap(screen.getByText('Follow local projects'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'projects',
  });

  fireEvent.tap(screen.getByText('Respond to consultations'));
  expect(navigate).toHaveBeenCalledWith({
    name: 'collection',
    collection: 'surveys',
  });
});
