// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';
import { renderUi } from '../../test-utils/renderUi';
import type { Update, UpdatesContent } from '../content/contentTypes';

type MockLinkProps = {
  to: string;
  params?: { slug: string };
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
};

let content: UpdatesContent;
vi.mock('../../routes/updates/index', () => ({
  Route: { useLoaderData: () => content },
}));
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: (props: MockLinkProps) => (
    <a
      href={
        props.params ? props.to.replace('$slug', props.params.slug) : props.to
      }
      className={props.className}
      aria-label={props['aria-label']}
    >
      {props.children}
    </a>
  ),
}));

const sample: Update = {
  documentId: 'sample-feature',
  slug: 'sample-feature',
  title: 'Sample featured story',
  kind: 'community',
  summary: 'Sample summary',
  body: 'Sample body',
  publishedOn: '2026-09-18',
  sourceName: 'Sample source',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-18',
  featured: true,
};

test('News leads with one labelled featured story before the remaining grid', async () => {
  content = {
    availability: 'ready',
    featuredUpdate: sample,
    items: [
      {
        ...sample,
        documentId: 'other',
        slug: 'other',
        title: 'Other local news',
      },
    ],
  };
  const { UpdatesPage } = await import('./UpdatesPage');
  const { container, unmount } = renderUi(<UpdatesPage />);
  const articles = container.querySelectorAll('article');
  expect(articles).toHaveLength(2);
  expect(articles[0]?.textContent).toContain('Featured news');
  expect(articles[0]?.querySelector('h2')?.textContent).toBe(sample.title);
  expect(articles[0]?.querySelectorAll('a')).toHaveLength(1);
  expect(articles[0]?.querySelector('a')?.getAttribute('href')).toBe(
    '/updates/sample-feature',
  );
  expect(articles[0]?.textContent).toContain('Sample source');
  expect(articles[1]?.textContent).toContain('Other local news');
  expect(container.querySelectorAll('h2')[1]?.textContent).toBe('Latest news');
  unmount();
});

test('News with only a feature does not show an empty message or a redundant latest heading', async () => {
  content = { availability: 'ready', featuredUpdate: sample, items: [] };
  const { UpdatesPage } = await import('./UpdatesPage');
  const { container, unmount } = renderUi(<UpdatesPage />);
  expect(container.textContent).toContain(sample.title);
  expect(container.textContent).not.toContain('No news published');
  expect(container.textContent).not.toContain('Latest news');
  unmount();
});

test.each(['ordinary', 'empty', 'unavailable'] as const)(
  'News preserves the %s state when there is no feature',
  async (state) => {
    content = {
      availability: state === 'unavailable' ? 'unavailable' : 'ready',
      items: state === 'ordinary' ? [sample] : [],
    };
    const { UpdatesPage } = await import('./UpdatesPage');
    const { container, unmount } = renderUi(<UpdatesPage />);
    expect(container.textContent).not.toContain('Featured news');
    expect(container.textContent).not.toContain('Latest news');
    if (state === 'ordinary')
      expect(container.querySelector('article h3')?.textContent).toBe(
        sample.title,
      );
    if (state === 'empty')
      expect(container.textContent).toContain('No news published');
    if (state === 'unavailable')
      expect(container.textContent).toContain('temporarily unavailable');
    unmount();
  },
);
