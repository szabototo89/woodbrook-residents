// @vitest-environment happy-dom
import { expect, test } from 'vitest';
import { renderUi } from '../test-utils/renderUi';
import { SiteSearch } from './SiteSearch';

test('search submits bounded query text to the public search route', () => {
  const { container, unmount } = renderUi(<SiteSearch query="park" />);
  const form = container.querySelector('form')!;
  expect(form.getAttribute('action')).toBe('/search');
  expect(form.getAttribute('method')).toBe('get');
  expect(form.getAttribute('aria-label')).toBe('Search Woodbrook');
  expect(container.querySelector('input')?.value).toBe('park');
  expect(container.querySelector('input')?.maxLength).toBe(120);
  expect(container.querySelector('button')?.type).toBe('submit');
  unmount();
});

test('compact search preserves a labelled form and keyboard submit action', () => {
  const { container, unmount } = renderUi(<SiteSearch compact />);
  expect(container.querySelector('form')?.getAttribute('aria-label')).toBe(
    'Header search',
  );
  expect(container.querySelector('input')?.getAttribute('aria-label')).toBe(
    'Search updates, events and services',
  );
  expect(container.querySelector('button')?.textContent).toBe('Search');
  unmount();
});
