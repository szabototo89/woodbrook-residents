// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { renderUi } from '../../test-utils/renderUi';
import type { HomeContent } from '../content/contentTypes';

type FakeLinkProps = {
  to: string;
  params?: { slug?: string };
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

function FakeLink(props: FakeLinkProps) {
  const slug = props.params?.slug;
  const href = slug ? props.to.replace('$slug', slug) : props.to;
  return (
    <a href={href} className={props.className} aria-label={props['aria-label']}>
      {props.children}
    </a>
  );
}

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: FakeLink,
  };
});

const emptyContent: HomeContent = {
  availability: 'ready',
  siteSetting: undefined,
  updates: [],
  projects: [],
  events: [],
  surveys: [],
};

let mockContent: HomeContent = emptyContent;

vi.mock('../../routes/index', () => ({
  Route: {
    useLoaderData: () => mockContent,
  },
}));

const fullContent: HomeContent = {
  availability: 'ready',
  siteSetting: {
    name: 'Woodbrook',
    location: 'Shankill',
    tagline: 'Custom tagline',
    introduction: 'Custom introduction',
  },
  updates: [
    {
      documentId: 'u1',
      title: 'Test update',
      slug: 'test-update',
      kind: 'news',
      summary: 'Summary',
      body: 'Body',
      publishedOn: '2026-09-10',
      sourceName: 'Source',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-10',
      featured: false,
    },
  ],
  projects: [
    {
      documentId: 'p1',
      title: 'Test project',
      slug: 'test-project',
      category: 'housing',
      stage: 'active',
      summary: 'Summary',
      details: 'Details',
      updatedOn: '2026-09-10',
      sourceName: 'Source',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-10',
      featured: false,
    },
  ],
  events: [
    {
      documentId: 'e1',
      title: 'Test event',
      slug: 'test-event',
      summary: 'Summary',
      startsAt: '2030-09-20T10:00:00.000Z',
      location: 'Shankill',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-10',
      featured: false,
    },
  ],
  surveys: [
    {
      documentId: 's1',
      title: 'Test consultation',
      slug: 'test-survey',
      stage: 'open',
      summary: 'Summary',
      sourceName: 'Source',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-10',
    },
  ],
};

test('home shortcuts deep-link to trades and services', async () => {
  mockContent = emptyContent;
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(
    container.querySelector('a[href="/local-info?category=trades"]'),
  ).not.toBeNull();
  unmount();
});

test('home page explains a content outage', async () => {
  mockContent = { ...emptyContent, availability: 'unavailable' };
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(container.textContent).toContain('temporarily unavailable');
  unmount();
});

test('home page shows content sections when content is ready', async () => {
  mockContent = fullContent;
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(container.textContent).toContain('Custom tagline');
  expect(container.textContent).toContain('What’s new in Woodbrook');
  expect(container.textContent).toContain('Upcoming event');
  expect(container.textContent).toContain('Public consultations');
  expect(container.textContent).toContain('Community projects');
  expect(
    container.querySelector('a[href="/events/test-event"]'),
  ).not.toBeNull();
  unmount();
});

test('homepage offers a public search and direct everyday service shortcuts', async () => {
  mockContent = emptyContent;
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(container.querySelector('h1')?.textContent).toBe(
    'Find what’s happening in Woodbrook, fast.',
  );
  expect(
    container.querySelector('form[role="search"]')?.getAttribute('action'),
  ).toBe('/search');
  expect(
    container.querySelector('input[type="search"]')?.getAttribute('name'),
  ).toBe('q');
  expect(container.textContent).toContain('Need something quickly?');
  expect(
    container.querySelector('a[href="/local-info?category=health"]')
      ?.textContent,
  ).toContain('Healthcare');
  expect(container.textContent).toContain('No upcoming events published');
  expect(container.textContent).toContain('No news published yet');
  unmount();
});

test('homepage preserves published images, detail URLs and event end time', async () => {
  mockContent = {
    ...fullContent,
    updates: [
      {
        ...fullContent.updates[0]!,
        imagePath: '/images/woodbrook-station.jpg',
        imageAlt: 'Published station photo',
      },
      {
        ...fullContent.updates[0]!,
        documentId: 'u2',
        slug: 'second-update',
        imagePath: '/images/shankill-coast.jpg',
      },
    ],
    projects: [
      {
        ...fullContent.projects[0]!,
        imagePath: '/images/woodbrook-station.jpg',
        imageAlt: 'Published project photo',
      },
      {
        ...fullContent.projects[0]!,
        documentId: 'p2',
        slug: 'second-project',
        imagePath: '/images/shankill-coast.jpg',
      },
    ],
    events: [{ ...fullContent.events[0]!, endsAt: '2030-09-20T12:00:00.000Z' }],
  };
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(
    container
      .querySelector('img[alt="Published station photo"]')
      ?.getAttribute('src'),
  ).toBe('/images/woodbrook-station.jpg');
  expect(
    container.querySelector('a[href="/updates/second-update"]'),
  ).not.toBeNull();
  expect(
    container
      .querySelector('img[alt="Published project photo"]')
      ?.getAttribute('src'),
  ).toBe('/images/woodbrook-station.jpg');
  expect(
    container.querySelector('a[href="/projects/second-project"]'),
  ).not.toBeNull();
  expect(container.textContent).toContain('11:00 – 13:00');
  unmount();
});

test('featured all-day events show the date without a misleading midnight time', async () => {
  mockContent = {
    ...fullContent,
    events: [
      {
        ...fullContent.events[0]!,
        startsAt: '2030-10-31T00:00:00.000Z',
        allDay: true,
      },
    ],
  };
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(container.querySelector('.home-event-meta')?.textContent).toContain(
    '31 October 2030',
  );
  expect(
    container.querySelector('.home-event-meta')?.textContent,
  ).not.toContain('0:00');
  unmount();
});

test('published Halloween events use seasonal illustration with their actual details', async () => {
  mockContent = {
    ...fullContent,
    events: [{ ...fullContent.events[0]!, title: 'Sample Halloween party' }],
  };
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(container.querySelector('#home-event-title')?.textContent).toBe(
    'Sample Halloween party',
  );
  expect(
    container.querySelector('.home-featured-event img')?.getAttribute('src'),
  ).toBe('/images/halloween-event.png');
  expect(
    container.querySelector('.home-featured-event a')?.getAttribute('href'),
  ).toBe('/events/test-event');
  unmount();
});
