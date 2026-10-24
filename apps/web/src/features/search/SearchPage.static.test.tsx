// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, test, vi } from 'vitest';

import { buildSearchIndex, type SearchParams } from './searchModel';
import { sampleSearchSnapshot } from '../../test-utils/searchContent';

let search: SearchParams = { q: '', category: 'all' };
vi.mock('../../routes/search', () => ({
  Route: {
    useLoaderData: () => ({
      availability: 'ready',
      items: buildSearchIndex(sampleSearchSnapshot),
    }),
    useSearch: () => search,
    useNavigate: () => vi.fn(),
  },
}));
type LinkProps = {
  to: string;
  params?: { slug: string };
  children: ReactNode;
  className?: string;
};

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: (props: LinkProps) => (
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

test('a saved search URL hydrates prerendered blank-query HTML without replacing it due to a mismatch', async () => {
  expect(__STATIC_SITE_BUILD__).toBe(true);
  const { SearchPage } = await import('./SearchPage');
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.innerHTML = renderToString(<SearchPage />);
  expect(container.textContent).toContain('What are you looking for?');
  search = { q: 'DART', category: 'services' };
  const recoverableError = vi.fn();
  const root = hydrateRoot(container, <SearchPage />, {
    onRecoverableError: recoverableError,
  });
  try {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(recoverableError).not.toHaveBeenCalled();
    expect(container.textContent).toContain('1 result for “DART”');
    expect(container.querySelector('input')?.value).toBe('DART');
    expect(container.querySelector('h2 a')?.getAttribute('href')).toBe(
      '/local-info/sample',
    );
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
