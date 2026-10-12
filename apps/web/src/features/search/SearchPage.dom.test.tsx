// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { click, getButtonByName, renderUi } from '../../test-utils/renderUi';
import { buildSearchIndex, type SearchResult } from './searchModel';
import { sampleSearchSnapshot } from '../../test-utils/searchContent';

const navigate = vi.fn();
let params = { q: 'DART', category: 'all' };
let content: { availability: 'ready' | 'unavailable'; items: SearchResult[] };
vi.mock('../../routes/search', () => ({
  Route: {
    useLoaderData: () => content,
    useSearch: () => params,
    useNavigate: () => navigate,
  },
}));
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: (props: {
    to: string;
    params?: { slug: string };
    children: ReactNode;
    className?: string;
  }) => (
    <a
      href={
        props.params ? props.to.replace('$slug', props.params.slug) : props.to
      }
      className={props.className}
    >
      {props.children}
    </a>
  ),
}));

const items = buildSearchIndex(sampleSearchSnapshot);
afterEach(() => {
  navigate.mockClear();
  params = { q: 'DART', category: 'all' };
});

test('uses the shared intro and content cards with their existing visible details', async () => {
  content = { availability: 'ready', items };
  const { SearchPage } = await import('./SearchPage');
  const { container, unmount } = renderUi(<SearchPage />);
  try {
    expect(container.querySelector('.page-intro h1')?.textContent).toBe(
      'Search results',
    );
    expect(container.textContent).toContain('5 results for “DART”');
    expect(container.querySelector('article h3 a')?.getAttribute('href')).toBe(
      '/updates/sample',
    );
    expect(container.textContent).toContain('Reviewed 12 October 2026');
    expect(container.textContent).toContain('Sample venue');
    expect(container.textContent).toContain('19:00');
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      '/images/sample.jpg',
    );
    expect(container.querySelectorAll('.update-card')).toHaveLength(1);
    expect(container.querySelectorAll('.project-card')).toHaveLength(1);
    expect(container.querySelectorAll('.event-card')).toHaveLength(1);
    expect(container.querySelectorAll('.survey-card')).toHaveLength(1);
    expect(container.querySelectorAll('.resource-card')).toHaveLength(1);
    expect(
      getButtonByName(container, 'Updates (2)').getAttribute('aria-pressed'),
    ).toBe('false');
  } finally {
    unmount();
  }
});

test('submits the draft query, preserves scroll on filtering, and clears into a focused field', async () => {
  content = { availability: 'ready', items: [items[0]!] };
  const { SearchPage } = await import('./SearchPage');
  const { container, unmount } = renderUi(<SearchPage />);
  try {
    const input = container.querySelector('input')!;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )!.set!;
    act(() => {
      setter.call(input, '  rail  ');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container
        .querySelector('form')!
        .dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true }),
        );
    });
    expect(navigate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        search: { q: 'rail', category: 'all' },
        resetScroll: false,
      }),
    );
    click(getButtonByName(container, 'Projects (0)'));
    expect(navigate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        search: { q: 'DART', category: 'projects' },
        resetScroll: false,
      }),
    );
    click(container.querySelector('[aria-label="Clear search"]')!);
    expect(navigate).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: { q: '', category: 'all' } }),
    );
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
  } finally {
    unmount();
  }
});

test('explains blank queries, unmatched searches, empty categories, unavailable content and loading', async () => {
  const { SearchPage } = await import('./SearchPage');
  const { SearchPending } = await import('./SearchPending');
  for (const state of [
    {
      q: '',
      category: 'all',
      availability: 'ready',
      heading: 'What are you looking for?',
    },
    {
      q: 'missing',
      category: 'all',
      availability: 'ready',
      heading: 'No results found',
    },
    {
      q: 'DART',
      category: 'projects',
      availability: 'ready',
      heading: 'No projects found',
    },
    {
      q: 'DART',
      category: 'all',
      availability: 'unavailable',
      heading: 'Community information is temporarily unavailable',
    },
  ] as const) {
    params = { q: state.q, category: state.category };
    content = { availability: state.availability, items: [items[0]!] };
    const { container, unmount } = renderUi(<SearchPage />);
    try {
      expect(container.textContent).toContain(state.heading);
      if (state.availability === 'ready')
        expect(container.querySelector('.empty-state')).not.toBeNull();
      if (state.heading === 'No projects found') {
        click(getButtonByName(container, 'View all results'));
        expect(navigate).toHaveBeenLastCalledWith(
          expect.objectContaining({ search: { q: 'DART', category: 'all' } }),
        );
      }
    } finally {
      unmount();
    }
  }
  const { container, unmount } = renderUi(<SearchPending />);
  try {
    expect(container.querySelector('[role="status"]')?.textContent).toContain(
      'Searching community information',
    );
  } finally {
    unmount();
  }
});

test('leaves shared site navigation to the root layout', async () => {
  content = { availability: 'ready', items: [items[0]!] };
  const { SearchPage } = await import('./SearchPage');
  const { container, unmount } = renderUi(<SearchPage />);
  try {
    expect(container.querySelector('nav')).toBeNull();
    expect(
      Array.from(container.querySelectorAll('a')).some(
        (link) => link.textContent?.trim() === 'Back',
      ),
    ).toBe(false);
  } finally {
    unmount();
  }
});

test('renders services with the directory card and a singular result count', async () => {
  params.category = 'services';
  content = { availability: 'ready', items };
  const { SearchPage } = await import('./SearchPage');
  const { container, unmount } = renderUi(<SearchPage />);
  try {
    expect(container.textContent).toContain('1 result for “DART”');
    expect(
      container.querySelector('.resource-card h2 a')?.getAttribute('href'),
    ).toBe('/local-info/sample');
    expect(container.textContent).toContain('Timetables and fares');
    expect(container.textContent).toContain('Sample stop');
  } finally {
    unmount();
  }
});
