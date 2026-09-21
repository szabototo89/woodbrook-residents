// @vitest-environment happy-dom
import { act } from 'react';
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { click, renderUi } from '../../test-utils/renderUi';
import type { Resource } from '../content/contentTypes';

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

const resource: Resource = {
  documentId: 'r1',
  title: 'Test plumber',
  slug: 'test-plumber',
  category: 'trades',
  serviceType: 'Plumber',
  providerType: 'business',
  description: 'Helpful plumber',
  phone: '01 234 5678',
  outOfHours: false,
  featured: false,
  details: [],
  collectionDates: [],
  displayOrder: 1,
  sourceName: 'Source',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
};

const mockNavigate = vi.fn();
let mockSearch: Record<string, unknown> = {};
let mockContent: { availability: 'ready' | 'unavailable'; items: Resource[] } =
  {
    availability: 'ready',
    items: [resource],
  };

vi.mock('../../routes/local-info/index', () => ({
  Route: {
    useLoaderData: () => ({ content: mockContent, today: '2026-09-10' }),
    useSearch: () => mockSearch,
    useNavigate: () => mockNavigate,
  },
}));

function typeIntoSearch(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;
  setter?.call(input, value);
  act(() => {
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function getSearchInput(container: ParentNode) {
  const input = container.querySelector('.directory-search-field input');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Expected directory search input');
  }
  return input;
}

test('typing into directory search preserves scroll position', async () => {
  mockContent = { availability: 'ready', items: [resource] };
  mockSearch = {};
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    typeIntoSearch(getSearchInput(container), 'plumber');

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ replace: true, resetScroll: false }),
    );
    expect(mockNavigate.mock.calls[0]?.[0].search).toEqual({ q: 'plumber' });
  } finally {
    unmount();
  }
});

test('changing directory filters preserves scroll position', async () => {
  mockContent = { availability: 'ready', items: [resource] };
  mockSearch = {};
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    const checkbox = container.querySelector('.out-of-hours-filter input');
    if (!(checkbox instanceof HTMLInputElement)) {
      throw new Error('Expected out-of-hours checkbox');
    }
    act(() => {
      checkbox.click();
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ replace: true, resetScroll: false }),
    );
  } finally {
    unmount();
  }
});

test('selecting a directory category preserves scroll position', async () => {
  mockContent = { availability: 'ready', items: [resource] };
  mockSearch = {};
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    const categoryButton = Array.from(
      container.querySelectorAll('.directory-filters button'),
    ).find((button) => button.textContent?.trim() === 'Trades');
    if (!categoryButton) {
      throw new Error('Expected Trades category button');
    }
    click(categoryButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
        resetScroll: false,
        search: { category: 'trades' },
      }),
    );
  } finally {
    unmount();
  }
});

test('clearing directory filters preserves scroll position', async () => {
  mockContent = { availability: 'ready', items: [resource] };
  mockSearch = { q: 'plumber' };
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    const clearButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Clear filters'),
    );
    if (!clearButton) {
      throw new Error('Expected Clear filters button');
    }
    click(clearButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
        resetScroll: false,
        search: {},
      }),
    );
  } finally {
    unmount();
  }
});

test('directory explains an empty directory', async () => {
  mockContent = { availability: 'ready', items: [] };
  mockSearch = {};
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    expect(container.textContent).toContain('No resources published');
  } finally {
    unmount();
  }
});

test('directory explains a content outage', async () => {
  mockContent = { availability: 'unavailable', items: [] };
  mockSearch = {};
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    expect(container.textContent).toContain('temporarily unavailable');
  } finally {
    unmount();
  }
});

test('directory explains when no contacts match the filters', async () => {
  mockContent = { availability: 'ready', items: [resource] };
  mockSearch = { q: 'dentist' };
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    expect(container.textContent).toContain('No matching contacts');
    expect(container.textContent).toContain('dentist');
  } finally {
    unmount();
  }
});

test('selecting all categories preserves scroll position', async () => {
  mockContent = { availability: 'ready', items: [resource] };
  mockSearch = { category: 'trades' };
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    const allButton = Array.from(
      container.querySelectorAll('.directory-filters button'),
    ).find((button) => button.textContent?.trim() === 'All');
    if (!allButton) {
      throw new Error('Expected All category button');
    }
    click(allButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
        resetScroll: false,
        search: {},
      }),
    );
  } finally {
    unmount();
  }
});

test('directory describes active category and out-of-hours filters', async () => {
  mockContent = { availability: 'ready', items: [resource] };
  mockSearch = { q: 'dentist', category: 'trades', ooh: '1' };
  mockNavigate.mockClear();
  const { LocalInfoPage } = await import('./LocalInfoPage');
  const { container, unmount } = renderUi(<LocalInfoPage />);
  try {
    expect(container.textContent).toContain('No matching contacts');
    expect(container.textContent).toContain('in Trades');
    expect(container.textContent).toContain('with an out-of-hours contact');
  } finally {
    unmount();
  }
});
