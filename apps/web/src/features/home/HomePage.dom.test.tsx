// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';

vi.mock('../../routes/index', () => ({
  Route: {
    useLoaderData: () => ({
      availability: 'ready',
      siteSetting: undefined,
      updates: [],
      projects: [],
      events: [],
      surveys: [],
    }),
  },
}));

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: ({ to, children, className, ...rest }: any) => (
      <a href={to} className={className} {...rest}>
        {children}
      </a>
    ),
  };
});

test('home start-here grid links to projects', async () => {
  const { HomePage } = await import('./HomePage');
  const { container, unmount } = renderUi(<HomePage />);
  expect(
    container.querySelector('.room-grid a[href="/projects"]'),
  ).not.toBeNull();
  unmount();
});
