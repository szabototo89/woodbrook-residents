// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import type { NewsParams } from './newsFilters';
import { sampleSearchSnapshot } from '../../test-utils/searchContent';

let search: NewsParams = { category: 'all', sort: 'newest' };
vi.mock('../../routes/updates/index', () => ({
  Route: {
    useLoaderData: () => ({
      availability: 'ready',
      items: sampleSearchSnapshot.updates,
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

test('saved News filters hydrate static default HTML without a mismatch', async () => {
  expect(__STATIC_SITE_BUILD__).toBe(true);
  const { UpdatesPage } = await import('./UpdatesPage');
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.innerHTML = renderToString(<UpdatesPage />);
  expect(container.textContent).toContain('1 article');
  search = { category: 'parks', sort: 'oldest' };
  const recoverableError = vi.fn();
  const root = hydrateRoot(container, <UpdatesPage />, {
    onRecoverableError: recoverableError,
  });
  try {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(recoverableError).not.toHaveBeenCalled();
    expect(container.textContent).toContain('No matching news');
    expect(
      container.querySelector<HTMLSelectElement>('#news-category')?.value,
    ).toBe('parks');
    expect(
      container.querySelector<HTMLSelectElement>('#news-sort')?.value,
    ).toBe('oldest');
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
