// @vitest-environment happy-dom
import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import { renderUi, getButtonByName } from '../../test-utils/renderUi';
type TestState = {
  status: string;
  user: {
    email: string;
    displayName: string | null;
    emailVerified: boolean;
  } | null;
  providers: { google: boolean; facebook: boolean };
  actions: Record<
    | 'login'
    | 'register'
    | 'socialLogin'
    | 'resetPassword'
    | 'updateName'
    | 'sendVerification'
    | 'signOut',
    ReturnType<typeof vi.fn>
  >;
};
const state = vi.hoisted<TestState>(() => ({
  status: 'ready',
  user: null,
  providers: { google: true, facebook: true },
  actions: {
    login: vi.fn(),
    register: vi.fn(),
    socialLogin: vi.fn(),
    resetPassword: vi.fn(),
    updateName: vi.fn(),
    sendVerification: vi.fn(),
    signOut: vi.fn(),
  },
}));
vi.mock('./AuthSession', () => ({ useAuthSession: () => state }));
vi.mock('./AuthProvider', () => ({
  useAuthFeature: () => ({ search: '?feature_flag=firebase-auth' }),
}));
import FirebaseForms from './FirebaseForms';

beforeEach(() => {
  vi.resetAllMocks();
  state.status = 'ready';
  state.user = null;
  state.providers = { google: true, facebook: true };
});
function fill(container: HTMLElement, name: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(
    `input[name="${name}"]`,
  );
  if (!input) throw new Error(`Missing ${name}`);
  input.value = value;
}
async function submit(container: HTMLElement) {
  await act(async () => {
    container
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}
async function press(container: HTMLElement, label: string) {
  await act(async () => {
    getButtonByName(container, label).click();
  });
}

test('login submits email and password without exposing provider errors', async () => {
  const ui = renderUi(<FirebaseForms page="login" />);
  fill(ui.container, 'email', 'resident@example.com');
  fill(ui.container, 'password', 'long-password');
  state.actions.login.mockRejectedValueOnce({
    code: 'auth/invalid-credential',
    message: 'internal details',
  });
  await submit(ui.container);
  expect(state.actions.login).toHaveBeenCalledWith(
    'resident@example.com',
    'long-password',
  );
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
    'Check your email and password',
  );
  expect(ui.container.textContent).not.toContain('internal details');
  await submit(ui.container);
  expect(state.actions.login).toHaveBeenCalledTimes(2);
  ui.unmount();
});
test('registration checks confirmation and submits name, email and password', async () => {
  const ui = renderUi(<FirebaseForms page="register" />);
  fill(ui.container, 'name', 'Sample Resident');
  fill(ui.container, 'email', 'resident@example.com');
  fill(ui.container, 'password', 'long-password');
  fill(ui.container, 'confirmPassword', 'different');
  await submit(ui.container);
  expect(state.actions.register).not.toHaveBeenCalled();
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
    'Passwords do not match',
  );
  fill(ui.container, 'confirmPassword', 'long-password');
  await submit(ui.container);
  expect(state.actions.register).toHaveBeenCalledWith(
    'resident@example.com',
    'long-password',
    'Sample Resident',
  );
  ui.unmount();
});
test('password recovery sends a link and gives an account-neutral confirmation', async () => {
  const ui = renderUi(<FirebaseForms page="forgot-password" />);
  fill(ui.container, 'email', 'resident@example.com');
  await submit(ui.container);
  expect(state.actions.resetPassword).toHaveBeenCalledWith(
    'resident@example.com',
  );
  expect(ui.container.querySelector('[role="status"]')?.textContent).toContain(
    'If an account exists',
  );
  expect(ui.container.querySelector('input[type="password"]')).toBeNull();
  ui.unmount();
});
test('only enabled social providers are offered and cancellation can be retried', async () => {
  state.providers.facebook = false;
  const ui = renderUi(<FirebaseForms page="login" />);
  expect(ui.container.textContent).not.toContain('Facebook');
  state.actions.socialLogin.mockRejectedValueOnce({
    code: 'auth/popup-closed-by-user',
  });
  await press(ui.container, 'Continue with Google');
  expect(state.actions.socialLogin).toHaveBeenCalledWith('google');
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
    'closed',
  );
  ui.unmount();
});
test('a signed-in resident can edit their name, verify email, reset password and sign out', async () => {
  state.user = {
    email: 'resident@example.com',
    displayName: 'Sample Resident',
    emailVerified: false,
  };
  const ui = renderUi(<FirebaseForms page="login" />);
  expect(ui.container.textContent).toContain('resident@example.com');
  fill(ui.container, 'name', 'Updated Sample');
  await submit(ui.container);
  expect(state.actions.updateName).toHaveBeenCalledWith('Updated Sample');
  await press(ui.container, 'Send verification email');
  expect(state.actions.sendVerification).toHaveBeenCalledOnce();
  await press(ui.container, 'Send password reset email');
  expect(state.actions.resetPassword).toHaveBeenCalledWith(
    'resident@example.com',
  );
  await press(ui.container, 'Sign out');
  expect(state.actions.signOut).toHaveBeenCalledOnce();
  ui.unmount();
});
test('loading and initialization errors do not collect credentials', () => {
  state.status = 'loading';
  const loading = renderUi(<FirebaseForms page="login" />);
  expect(loading.container.querySelector('[role="status"]')).not.toBeNull();
  expect(loading.container.querySelector('form')).toBeNull();
  loading.unmount();
  state.status = 'error';
  const failed = renderUi(<FirebaseForms page="login" />);
  expect(
    failed.container.querySelector('[role="alert"]')?.textContent,
  ).toContain('temporarily unavailable');
  failed.unmount();
});
test('pending requests cannot be submitted twice', async () => {
  const pending = Promise.withResolvers<void>();
  state.actions.login.mockReturnValueOnce(pending.promise);
  const ui = renderUi(<FirebaseForms page="login" />);
  fill(ui.container, 'email', 'resident@example.com');
  fill(ui.container, 'password', 'long-password');
  await submit(ui.container);
  await submit(ui.container);
  expect(state.actions.login).toHaveBeenCalledOnce();
  expect(getButtonByName(ui.container, 'Please wait…').disabled).toBe(true);
  await act(async () => pending.resolve());
  ui.unmount();
});
test('Facebook login uses the configured provider', async () => {
  const ui = renderUi(<FirebaseForms page="register" />);
  await press(ui.container, 'Continue with Facebook');
  expect(state.actions.socialLogin).toHaveBeenCalledWith('facebook');
  ui.unmount();
});
test('verified accounts with no profile name have a blank editable name and no resend action', async () => {
  state.user = { email: '', displayName: null, emailVerified: true };
  const ui = renderUi(<FirebaseForms page="login" />);
  expect(ui.container.textContent).toContain('Email verified');
  expect(ui.container.textContent).not.toContain('Send verification email');
  expect(ui.container.textContent).not.toContain('Send password reset email');
  state.actions.updateName.mockRejectedValueOnce({
    code: 'auth/network-request-failed',
  });
  await submit(ui.container);
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
    'connection',
  );
  ui.unmount();
});
