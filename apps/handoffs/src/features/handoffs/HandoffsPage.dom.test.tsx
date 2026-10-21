// @vitest-environment happy-dom
import { act } from 'react';
import { expect, test } from 'vitest';
import {
  click,
  getButtonByName,
  renderUi,
  selectOption,
  typeInto,
} from '../../test-utils/renderUi';
import { HandoffsPage } from './HandoffsPage';

const documents = [
  {
    slug: 'clerk-authentication',
    title: 'Clerk accounts',
    summary: 'Email authentication is blocked in production.',
    status: 'blocked',
    updatedAt: '2026-10-21T14:57:45Z',
    Content: () => null,
  },
  {
    slug: 'news-order',
    title: 'News order',
    summary: 'Articles appear newest first.',
    status: 'complete',
    updatedAt: '2026-10-20T10:00:00Z',
    Content: () => null,
  },
  {
    slug: 'c4-diagrams',
    title: 'C4 diagrams',
    summary: 'Architecture views rendered locally.',
    status: 'complete',
    updatedAt: '2026-10-19T09:00:00Z',
    Content: () => null,
  },
];

const DAY = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString();

function handoff(
  slug: string,
  title: string,
  updatedAt: string | undefined,
  summary = 'Summary.',
) {
  return {
    slug,
    title,
    summary,
    status: 'complete',
    updatedAt,
    Content: () => null,
  };
}

const recentDocuments = [
  handoff('today', 'Today handoff', ago(1)),
  handoff('week', 'This week handoff', ago(3)),
  handoff('month', 'This month handoff', ago(20)),
  handoff('quarter', 'This quarter handoff', ago(60)),
  handoff('undated', 'Undated handoff', undefined),
];

function searchInput(container: ParentNode) {
  return container.querySelector<HTMLInputElement>('input[type="search"]')!;
}

function cardTitles(container: ParentNode) {
  return Array.from(container.querySelectorAll('.handoff-card h2')).map(
    (heading) => heading.textContent,
  );
}

test('search filters handoffs by status, title and summary', () => {
  const view = renderUi(<HandoffsPage documents={documents} />);
  expect(cardTitles(view.container)).toHaveLength(3);

  typeInto(searchInput(view.container), 'BLOCKED');
  expect(cardTitles(view.container)).toEqual(['Clerk accounts']);
  expect(view.container.textContent).toContain('1 of 3 handoffs');

  typeInto(searchInput(view.container), 'architecture');
  expect(cardTitles(view.container)).toEqual(['C4 diagrams']);

  typeInto(searchInput(view.container), 'news');
  expect(cardTitles(view.container)).toEqual(['News order']);

  typeInto(searchInput(view.container), '  complete  ');
  expect(cardTitles(view.container)).toEqual(['News order', 'C4 diagrams']);

  view.unmount();
});

test('search reports no matches and both clear actions restore the index', () => {
  const view = renderUi(<HandoffsPage documents={documents} />);
  const input = searchInput(view.container);

  typeInto(input, 'zzz');
  expect(cardTitles(view.container)).toEqual([]);
  expect(view.container.textContent).toContain('No matching handoffs');
  expect(view.container.textContent).toContain('zzz');
  expect(view.container.textContent).toContain('0 of 3 handoffs');

  click(getButtonByName(view.container, 'Clear search'));
  expect(cardTitles(view.container)).toHaveLength(3);
  expect(searchInput(view.container).value).toBe('');

  act(() => {
    searchInput(view.container).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
    );
    searchInput(view.container).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
  });
  expect(cardTitles(view.container)).toHaveLength(3);

  typeInto(searchInput(view.container), 'clerk');
  act(() => {
    searchInput(view.container).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
  });
  expect(cardTitles(view.container)).toHaveLength(3);

  typeInto(searchInput(view.container), 'missing');
  click(getButtonByName(view.container, 'Show all handoffs'));
  expect(cardTitles(view.container)).toHaveLength(3);
  expect(searchInput(view.container).value).toBe('');

  view.unmount();
});

test('quick time ranges filter by update date and combine with search', () => {
  const view = renderUi(<HandoffsPage documents={recentDocuments} />);
  expect(cardTitles(view.container)).toEqual([
    'Today handoff',
    'This week handoff',
    'This month handoff',
    'This quarter handoff',
    'Undated handoff',
  ]);

  click(getButtonByName(view.container, '7 days'));
  expect(cardTitles(view.container)).toEqual([
    'Today handoff',
    'This week handoff',
  ]);
  expect(view.container.textContent).toContain('2 of 5 handoffs');

  click(getButtonByName(view.container, '30 days'));
  expect(cardTitles(view.container)).toHaveLength(3);

  click(getButtonByName(view.container, '90 days'));
  expect(cardTitles(view.container)).toHaveLength(4);

  click(getButtonByName(view.container, 'All'));
  expect(cardTitles(view.container)).toHaveLength(5);
  expect(
    getButtonByName(view.container, 'All').getAttribute('aria-pressed'),
  ).toBe('true');
  expect(
    getButtonByName(view.container, '7 days').getAttribute('aria-pressed'),
  ).toBe('false');

  click(getButtonByName(view.container, '7 days'));
  typeInto(searchInput(view.container), 'month');
  expect(cardTitles(view.container)).toEqual([]);
  expect(view.container.textContent).toContain('No matching handoffs');
  expect(view.container.textContent).toContain('last 7 days');

  click(getButtonByName(view.container, 'Show all handoffs'));
  expect(cardTitles(view.container)).toHaveLength(5);
  expect(searchInput(view.container).value).toBe('');

  view.unmount();
});

test('an empty time range explains the active window', () => {
  const view = renderUi(
    <HandoffsPage documents={[handoff('old', 'Old handoff', ago(40))]} />,
  );
  click(getButtonByName(view.container, '7 days'));
  expect(cardTitles(view.container)).toEqual([]);
  expect(view.container.textContent).toContain(
    'No handoffs were updated in the last 7 days.',
  );
  click(getButtonByName(view.container, 'Show all handoffs'));
  expect(cardTitles(view.container)).toEqual(['Old handoff']);
  view.unmount();
});

test('sort options order by newest, oldest or title', () => {
  const view = renderUi(<HandoffsPage documents={recentDocuments} />);
  const sort = view.container.querySelector('select')!;

  expect(cardTitles(view.container)).toEqual([
    'Today handoff',
    'This week handoff',
    'This month handoff',
    'This quarter handoff',
    'Undated handoff',
  ]);

  act(() => {
    sort.value = 'unknown';
    sort.dispatchEvent(new Event('change', { bubbles: true }));
  });
  expect(cardTitles(view.container)).toEqual([
    'Today handoff',
    'This week handoff',
    'This month handoff',
    'This quarter handoff',
    'Undated handoff',
  ]);

  selectOption(sort, 'oldest');
  expect(cardTitles(view.container)).toEqual([
    'This quarter handoff',
    'This month handoff',
    'This week handoff',
    'Today handoff',
    'Undated handoff',
  ]);

  selectOption(sort, 'title');
  expect(cardTitles(view.container)).toEqual([
    'This month handoff',
    'This quarter handoff',
    'This week handoff',
    'Today handoff',
    'Undated handoff',
  ]);

  selectOption(sort, 'newest');
  click(getButtonByName(view.container, '7 days'));
  selectOption(sort, 'oldest');
  expect(cardTitles(view.container)).toEqual([
    'This week handoff',
    'Today handoff',
  ]);

  view.unmount();

  const undated = renderUi(
    <HandoffsPage
      documents={[
        handoff('beta', 'Beta', undefined),
        handoff('alpha', 'Alpha', undefined),
      ]}
    />,
  );
  expect(cardTitles(undated.container)).toEqual(['Alpha', 'Beta']);
  undated.unmount();
});

test('an unknown status keeps a neutral badge and label', () => {
  const view = renderUi(
    <HandoffsPage
      documents={[handoff('draft', 'Draft handoff', ago(1))].map(
        (document) => ({
          ...document,
          status: 'provisional',
        }),
      )}
    />,
  );
  expect(view.container.textContent).toContain('Provisional');
  expect(
    view.container.querySelector('.handoff-status--provisional'),
  ).not.toBeNull();
  view.unmount();
});
