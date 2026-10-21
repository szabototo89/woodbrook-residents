// @vitest-environment happy-dom
import { act, createElement, type ReactNode } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';

const state = vi.hoisted(() => ({
  enabled: true,
  configured: true,
  ready: true,
  search: '?feature_flag=clerk-auth',
  isLoaded: true,
  isSignedIn: false,
}));
const sdk = vi.hoisted(() => ({
  provider: vi.fn(),
  signIn: vi.fn().mockReturnValue('Secure login'),
  signUp: vi.fn().mockReturnValue('Secure registration'),
}));
vi.mock('./AuthProvider', () => ({ useAuthFeature: () => state }));
vi.mock('@clerk/react', () => ({
  ClerkProvider: (props: { children: ReactNode }) => {
    sdk.provider(props);
    return props.children;
  },
  ClerkFailed: () => null,
  ClerkLoading: () => null,
  ClerkLoaded: (props: { children: ReactNode }) => props.children,
  SignIn: sdk.signIn,
  SignUp: sdk.signUp,
  UserButton: () => createElement('button', {}, 'Manage account'),
  useUser: () => state,
  useSignIn: () => ({ signIn: {}, fetchStatus: 'idle' }),
}));
import { AccountLinks } from './AccountLinks';
import { AuthPage } from './AuthPage';
import ClerkAccount from './ClerkAccount';
import ClerkForms from './ClerkForms';
import ClerkRuntime from './ClerkRuntime';

beforeEach(() => {
  Object.assign(state, {
    enabled: true,
    configured: true,
    ready: true,
    isLoaded: true,
    isSignedIn: false,
  });
  vi.clearAllMocks();
});

test('Clerk receives account URLs and post-auth destinations with the preview flag', () => {
  const ui = renderUi(
    <ClerkRuntime publishableKey="pk_test_example" search={state.search}>
      <p>Public content</p>
    </ClerkRuntime>,
  );
  expect(sdk.provider).toHaveBeenCalledWith(
    expect.objectContaining({
      publishableKey: 'pk_test_example',
      signInUrl: '/login?feature_flag=clerk-auth',
      signUpUrl: '/register?feature_flag=clerk-auth',
      afterSignOutUrl: '/?feature_flag=clerk-auth',
      signInFallbackRedirectUrl: '/?feature_flag=clerk-auth',
      signUpFallbackRedirectUrl: '/?feature_flag=clerk-auth',
    }),
  );
  expect(ui.container.textContent).toContain('Public content');
  ui.unmount();
});

test('account controls show loading, login, and profile management states', () => {
  state.isLoaded = false;
  const loading = renderUi(<ClerkAccount />);
  expect(loading.container.textContent).toContain('Loading account');
  loading.unmount();
  state.isLoaded = true;
  const signedOut = renderUi(<ClerkAccount />);
  expect(signedOut.container.querySelector('a')?.getAttribute('href')).toBe(
    '/login?feature_flag=clerk-auth',
  );
  signedOut.unmount();
  state.isSignedIn = true;
  const signedIn = renderUi(<ClerkAccount />);
  expect(signedIn.container.querySelector('button')?.textContent).toBe(
    'Manage account',
  );
  signedIn.unmount();
});

test('account navigation is absent when disabled and links to login before configuration', () => {
  state.enabled = false;
  const disabled = renderUi(<AccountLinks />);
  expect(disabled.container.textContent).toBe('');
  disabled.unmount();
  state.enabled = true;
  state.configured = false;
  const enabled = renderUi(<AccountLinks />);
  expect(enabled.container.querySelector('a')?.textContent).toBe('Log in');
  enabled.unmount();
});

test('configured account navigation loads the signed-in profile control', async () => {
  state.isSignedIn = true;
  const ui = renderUi(<AccountLinks />);
  await act(async () => {
    await import('./ClerkAccount');
  });
  expect(ui.container.textContent).toContain('Manage account');
  ui.unmount();
});

test('login and registration use Clerk hash routing for static hosting', () => {
  const login = renderUi(<ClerkForms page="login" />);
  expect(sdk.signIn).toHaveBeenCalledWith(
    expect.objectContaining({ routing: 'hash' }),
    undefined,
  );
  login.unmount();
  const registration = renderUi(<ClerkForms page="register" />);
  expect(sdk.signUp).toHaveBeenCalledWith(
    expect.objectContaining({ routing: 'hash' }),
    undefined,
  );
  registration.unmount();
});

test('signed-in visitors can return to the hub instead of seeing a login form', () => {
  state.isSignedIn = true;
  const ui = renderUi(<ClerkForms page="register" />);
  expect(ui.container.textContent).toContain('You’re logged in');
  expect(ui.container.querySelector('a')?.getAttribute('href')).toBe(
    '/?feature_flag=clerk-auth',
  );
  ui.unmount();
});

test('account page waits for hydration and loads configured forms', async () => {
  state.ready = false;
  const loading = renderUi(<AuthPage page="login" />);
  expect(
    loading.container.querySelector('[role="status"]')?.textContent,
  ).toContain('Loading account access');
  loading.unmount();
  state.ready = true;
  const configured = renderUi(<AuthPage page="login" />);
  await act(async () => {
    await import('./ClerkForms');
  });
  expect(configured.container.textContent).toContain('Secure login');
  configured.unmount();
});

test('the dedicated recovery route presents an email reset form', () => {
  const ui = renderUi(<ClerkForms page="forgot-password" />);
  expect(ui.container.querySelector('label')?.textContent).toContain(
    'Email address',
  );
  expect(ui.container.querySelector('input')?.getAttribute('type')).toBe(
    'email',
  );
  ui.unmount();
});
