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

function FakeLink({
  to,
  params,
  children,
  className,
  'aria-label': ariaLabel,
}: FakeLinkProps) {
  const slug = params?.slug;
  const href = slug ? to.replace('$slug', slug) : to;
  return (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
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

test('home start-here grid links to projects', async () => {
  mockContent = emptyContent;
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(
    container.querySelector('.room-grid a[href="/projects"]'),
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
  expect(container.textContent).toContain('Useful things to know');
  expect(container.textContent).toContain('Coming up nearby');
  expect(container.textContent).toContain('Public consultations');
  expect(container.textContent).toContain('Projects shaping the place');
  expect(container.textContent).toContain('1 upcoming date');
  unmount();
});
