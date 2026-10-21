// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';
const state = vi.hoisted(() => ({ search: '', runtime: vi.fn() }));
vi.mock('@tanstack/react-router', () => ({
  useRouterState: (options: {
    select: (value: { location: { searchStr: string } }) => string;
  }) => options.select({ location: { searchStr: state.search } }),
}));
vi.mock('./ClerkRuntime', () => ({
  default: (props: { children: ReactNode }) => {
    state.runtime();
    return props.children;
  },
}));
import { AuthProvider } from './AuthProvider';
import { AccountLinks } from './AccountLinks';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  state.search = '';
});

test('public pages render without loading Clerk when authentication is disabled', () => {
  vi.stubEnv('VITE_CLERK_AUTH_ENABLED', 'false');
  const ui = renderUi(
    <AuthProvider>
      <AccountLinks />
      <p>Community hub</p>
    </AuthProvider>,
  );
  expect(ui.container.textContent).toBe('Community hub');
  expect(state.runtime).not.toHaveBeenCalled();
  ui.unmount();
});

test('query previews without a key show login navigation without loading Clerk', () => {
  state.search = '?feature_flag=clerk-auth';
  vi.stubEnv('VITE_CLERK_PUBLISHABLE_KEY', '');
  const ui = renderUi(
    <AuthProvider>
      <AccountLinks />
    </AuthProvider>,
  );
  expect(ui.container.querySelector('a')?.getAttribute('href')).toBe(
    '/login?feature_flag=clerk-auth',
  );
  expect(state.runtime).not.toHaveBeenCalled();
  ui.unmount();
});

test('the environment flag loads Clerk only with a valid publishable key', async () => {
  vi.stubEnv('VITE_CLERK_AUTH_ENABLED', 'true');
  vi.stubEnv(
    'VITE_CLERK_PUBLISHABLE_KEY',
    `pk_test_${btoa('example.clerk.accounts.dev$')}`,
  );
  const ui = renderUi(
    <AuthProvider>
      <p>Community hub</p>
    </AuthProvider>,
  );
  await act(async () => {
    await import('./ClerkRuntime');
  });
  expect(state.runtime).toHaveBeenCalled();
  expect(ui.container.textContent).toBe('Community hub');
  ui.unmount();
});
