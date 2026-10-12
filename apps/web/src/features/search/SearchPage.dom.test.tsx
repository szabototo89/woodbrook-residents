// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { click, getButtonByName, renderUi } from '../../test-utils/renderUi';
import type { SearchResult } from './searchModel';

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
  Link: (props: { to: string; children: ReactNode; className?: string }) => (
    <a href={props.to} className={props.className}>
      {props.children}
    </a>
  ),
}));

const item: SearchResult = {
  id: 'sample',
  category: 'updates',
  title: 'Sample DART update',
  summary: 'Sample information.',
  href: '/updates/sample',
  badge: 'Local update',
  tone: 'green',
  typeLabel: 'Transport',
  sourceName: 'Sample source',
  date: '2026-10-12',
  searchText: 'Sample DART update',
};

afterEach(() => {
  navigate.mockClear();
  params = { q: 'DART', category: 'all' };
});

test('shows linked cards, counts, source and dates, thumbnails and event metadata', async () => {
  content = {
    availability: 'ready',
    items: [
      item,
      { ...item, id: 'image', imagePath: '/sample.jpg' },
      {
        ...item,
        id: 'event',
        category: 'events',
        title: 'Sample DART event',
        event: {
          documentId: 'event',
          slug: 'event',
          title: 'Sample event',
          summary: 'Sample',
          startsAt: '2026-11-07T19:00:00Z',
          endsAt: '2026-11-07T20:30:00Z',
          location: 'Sample venue',
          sourceUrl: 'https://example.com',
          sourceReviewedOn: '2026-10-12',
          featured: false,
        },
      },
    ],
  };
  const { SearchPage } = await import('./SearchPage');
  const { container, unmount } = renderUi(<SearchPage />);
  try {
    expect(container.querySelector('h1')?.textContent).toBe('Search results');
    expect(container.textContent).toContain('3 results for “DART”');
    expect(container.querySelector('h2 a')?.getAttribute('href')).toBe(
      '/updates/sample',
    );
    expect(container.textContent).toContain('Sample source');
    expect(container.textContent).toContain('Updated 12 October 2026');
    expect(container.textContent).toContain('Sample venue');
    expect(container.textContent).toContain('19:00');
    expect(container.textContent).toContain('20:30');
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      '/sample.jpg',
    );
    expect(
      getButtonByName(container, 'Updates (2)').getAttribute('aria-pressed'),
    ).toBe('false');
  } finally {
    unmount();
  }
});

test('submits the draft query, preserves scroll on filtering, and clears into a focused field', async () => {
  content = { availability: 'ready', items: [item] };
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
    content = { availability: state.availability, items: [item] };
    const { container, unmount } = renderUi(<SearchPage />);
    try {
      expect(container.textContent).toContain(state.heading);
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

test('uses a location icon for non-transport services', async () => {
  params.category = 'services';
  content = {
    availability: 'ready',
    items: [{ ...item, category: 'services', typeLabel: 'Health' }],
  };
  const { SearchPage } = await import('./SearchPage');
  const { container, unmount } = renderUi(<SearchPage />);
  try {
    expect(
      container.querySelector('.search-result-image .lucide-map-pin'),
    ).not.toBeNull();
  } finally {
    unmount();
  }
});

test('leaves shared site navigation to the root layout', async () => {
  content = { availability: 'ready', items: [item] };
  const { SearchPage } = await import('./SearchPage');
  const { container, unmount } = renderUi(<SearchPage />);
  try {
    expect(container.querySelector('nav')).toBeNull();
  } finally {
    unmount();
  }
});

test('filters to a singular service result and renders events without end times', async () => {
  params.category = 'services';
  content = {
    availability: 'ready',
    items: [
      { ...item, category: 'services', sourceName: undefined, date: undefined },
    ],
  };
  const { SearchPage } = await import('./SearchPage');
  let rendered = renderUi(<SearchPage />);
  try {
    expect(rendered.container.textContent).toContain('1 result for “DART”');
  } finally {
    rendered.unmount();
  }
  params.category = 'events';
  content.items = [
    {
      ...item,
      category: 'events',
      event: {
        documentId: 'sample',
        title: 'Sample',
        slug: 'sample',
        summary: 'Sample',
        startsAt: '2026-11-07T19:00:00Z',
        location: 'Sample venue',
        sourceUrl: 'https://example.com',
        sourceReviewedOn: '2026-10-12',
        featured: false,
      },
    },
  ];
  rendered = renderUi(<SearchPage />);
  try {
    expect(rendered.container.textContent).toContain('19:00');
  } finally {
    rendered.unmount();
  }
});
