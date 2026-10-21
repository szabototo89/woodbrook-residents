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
vi.mock('./FirebaseRuntime', () => ({
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

test('public pages render without loading Firebase when authentication is disabled', () => {
  vi.stubEnv('VITE_FIREBASE_AUTH_ENABLED', 'false');
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

test('query previews without a key show login navigation without loading Firebase', () => {
  state.search = '?feature_flag=firebase-auth';
  vi.stubEnv('VITE_FIREBASE_API_KEY', '');
  const ui = renderUi(
    <AuthProvider>
      <AccountLinks />
    </AuthProvider>,
  );
  expect(ui.container.querySelector('a')?.getAttribute('href')).toBe(
    '/login?feature_flag=firebase-auth',
  );
  expect(state.runtime).not.toHaveBeenCalled();
  ui.unmount();
});

test('the environment flag loads Firebase only with a complete Firebase config', async () => {
  vi.stubEnv('VITE_FIREBASE_AUTH_ENABLED', 'true');
  vi.stubEnv('VITE_FIREBASE_API_KEY', 'sample-key');
  vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'sample.firebaseapp.com');
  vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'sample');
  vi.stubEnv('VITE_FIREBASE_APP_ID', '1:123:web:456');
  const ui = renderUi(
    <AuthProvider>
      <p>Community hub</p>
    </AuthProvider>,
  );
  await act(async () => {
    await import('./FirebaseRuntime');
  });
  expect(state.runtime).toHaveBeenCalled();
  expect(ui.container.textContent).toBe('Community hub');
  ui.unmount();
});
