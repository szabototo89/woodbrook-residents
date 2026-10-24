// @vitest-environment happy-dom
import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';
import { click, getButtonByName, renderUi } from '../../test-utils/renderUi';
import type { Update, UpdatesContent } from '../content/contentTypes';

type MockLinkProps = {
  to: string;
  params?: { slug: string };
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
};

let content: UpdatesContent;
let params = { category: 'all', sort: 'newest' };
const navigate = vi.fn();
beforeEach(() => {
  params = { category: 'all', sort: 'newest' };
  navigate.mockClear();
});
vi.mock('../../routes/updates/index', () => ({
  Route: {
    useLoaderData: () => content,
    useSearch: () => params,
    useNavigate: () => navigate,
  },
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

test('category and sort controls preserve each other in the URL and reset together', async () => {
  content = { availability: 'ready', featuredUpdate: sample, items: [] };
  params = { category: 'transport', sort: 'oldest' };
  const { UpdatesPage } = await import('./UpdatesPage');
  const { container, unmount } = renderUi(<UpdatesPage />);
  try {
    const category =
      container.querySelector<HTMLSelectElement>('#news-category')!;
    const sort = container.querySelector<HTMLSelectElement>('#news-sort')!;
    expect(category.value).toBe('transport');
    expect(sort.value).toBe('oldest');
    act(() => {
      category.value = 'housing';
      category.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(navigate).toHaveBeenLastCalledWith({
      search: { category: 'housing', sort: 'oldest' },
      resetScroll: false,
    });
    act(() => {
      sort.value = 'newest';
      sort.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(navigate).toHaveBeenLastCalledWith({
      search: { category: 'transport', sort: 'newest' },
      resetScroll: false,
    });
    expect(container.textContent).toContain('No matching news');
    click(getButtonByName(container, 'Reset filters'));
    expect(navigate).toHaveBeenLastCalledWith({
      search: { category: 'all', sort: 'newest' },
      resetScroll: false,
    });
  } finally {
    unmount();
  }
});

test('a filtered feature appears once in results, and the result count is announced', async () => {
  content = {
    availability: 'ready',
    featuredUpdate: sample,
    items: [
      {
        ...sample,
        documentId: 'other',
        kind: 'transport',
        title: 'Transport article',
      },
    ],
  };
  params = { category: 'community', sort: 'newest' };
  const { UpdatesPage } = await import('./UpdatesPage');
  const { container, unmount } = renderUi(<UpdatesPage />);
  try {
    expect(container.querySelector('[role="status"]')?.textContent).toBe(
      '1 article',
    );
    expect(container.querySelectorAll('article')).toHaveLength(1);
    expect(container.querySelector('article h3')?.textContent).toBe(
      sample.title,
    );
    expect(container.textContent).not.toContain('Featured news');
    expect(container.textContent).not.toContain('Transport article');
  } finally {
    unmount();
  }
});
