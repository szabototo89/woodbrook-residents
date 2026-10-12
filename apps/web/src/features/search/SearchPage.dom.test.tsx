// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';
import type { ContentCollection } from '../content/contentTypes';
import type { SearchResult } from './siteSearch';
const state = vi.hoisted(() => {
  const content: ContentCollection<SearchResult> = {
    availability: 'ready',
    items: [],
  };
  return { q: '', content };
});
vi.mock('../../routes/search', () => ({
  Route: {
    useSearch: () => ({ q: state.q }),
    useLoaderData: () => state.content,
  },
}));
vi.mock('../../components/PageIntro', () => ({
  PageIntro: (props: { title: string }) => <h1>{props.title}</h1>,
}));
import { SearchPage } from './SearchPage';

test('search prompts for text before showing results', () => {
  state.q = '';
  state.content = { availability: 'ready', items: [] };
  const { container, unmount } = renderUi(<SearchPage />);
  expect(container.querySelector('[role="status"]')?.textContent).toContain(
    'Enter a search',
  );
  expect(container.querySelectorAll('.search-result')).toHaveLength(0);
  unmount();
});

test('search gives useful empty-result guidance', () => {
  state.q = 'missing';
  const { container, unmount } = renderUi(<SearchPage />);
  expect(container.querySelector('[role="status"]')?.textContent).toContain(
    '0 results for “missing”',
  );
  expect(container.textContent).toContain('Try a broader search');
  unmount();
});

test('search renders matching public details links and result counts', () => {
  state.q = 'park';
  state.content = {
    availability: 'ready',
    items: [
      {
        title: 'Park project',
        summary: 'Accessible paths',
        type: 'Project',
        href: '/projects/park',
      },
    ],
  };
  const first = renderUi(<SearchPage />);
  expect(first.container.querySelector('[role="status"]')?.textContent).toBe(
    '1 result for “park”',
  );
  expect(first.container.querySelector('a')?.getAttribute('href')).toBe(
    '/projects/park',
  );
  first.unmount();
  state.content.items = [
    ...state.content.items,
    {
      title: 'Park consultation',
      summary: 'Have your say',
      type: 'Consultation',
      href: '/surveys/park',
    },
  ];
  const second = renderUi(<SearchPage />);
  expect(second.container.querySelector('[role="status"]')?.textContent).toBe(
    '2 results for “park”',
  );
  second.unmount();
});

test('search explains a source outage without pretending there are no matches', () => {
  state.content = { availability: 'unavailable', items: [] };
  const { container, unmount } = renderUi(<SearchPage />);
  expect(container.textContent).toContain('temporarily unavailable');
  expect(container.textContent).not.toContain('0 results');
  unmount();
});
