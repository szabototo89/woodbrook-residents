// @vitest-environment happy-dom
import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';
const client = vi.hoisted(() => ({
  create: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  actions: {},
}));
const feature = vi.hoisted(() => ({
  enabled: true,
  configured: true,
  ready: true,
  search: '?feature_flag=firebase-auth',
}));
vi.mock('./firebaseClient', () => ({ createFirebaseClient: client.create }));
vi.mock('./AuthProvider', () => ({ useAuthFeature: () => feature }));
import FirebaseRuntime from './FirebaseRuntime';
import FirebaseAccount from './FirebaseAccount';
import FirebaseForms from './FirebaseForms';
import { AccountLinks } from './AccountLinks';
import { AuthPage } from './AuthPage';
const config = {
  apiKey: 'key',
  authDomain: 'sample.firebaseapp.com',
  projectId: 'sample',
  appId: 'app',
};
beforeEach(() => {
  vi.clearAllMocks();
  feature.enabled = true;
  feature.configured = true;
  client.subscribe.mockReturnValue(client.unsubscribe);
  client.create.mockReturnValue(client);
});
test('runtime keeps public content visible while observing the session and unsubscribes on exit', () => {
  const ui = renderUi(
    <FirebaseRuntime config={config}>
      <FirebaseAccount />
      <p>Public hub</p>
    </FirebaseRuntime>,
  );
  expect(ui.container.textContent).toContain('Public hub');
  expect(ui.container.textContent).toContain('Loading account');
  act(() => client.subscribe.mock.calls[0]?.[0](null));
  expect(ui.container.querySelector('a')?.getAttribute('href')).toBe(
    '/login?feature_flag=firebase-auth',
  );
  act(() =>
    client.subscribe.mock.calls[0]?.[0]({
      email: 'resident@example.com',
      displayName: 'Sample',
      emailVerified: true,
    }),
  );
  expect(ui.container.querySelector('a')?.textContent).toBe('Account');
  ui.unmount();
  expect(client.unsubscribe).toHaveBeenCalledOnce();
});
test.each(['creation', 'subscription'])(
  'runtime displays a recoverable %s error without breaking public content',
  (kind) => {
    if (kind === 'creation')
      client.create.mockImplementationOnce(() => {
        throw new Error('SDK failed');
      });
    const ui = renderUi(
      <FirebaseRuntime config={config}>
        <FirebaseForms page="login" />
        <p>Public hub</p>
      </FirebaseRuntime>,
    );
    if (kind === 'subscription')
      act(() => client.subscribe.mock.calls[0]?.[1]());
    expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
      'temporarily unavailable',
    );
    expect(ui.container.textContent).toContain('Public hub');
    ui.unmount();
  },
);
test('navigation stays absent when disabled and offers a login link before configuration', () => {
  feature.enabled = false;
  const disabled = renderUi(<AccountLinks />);
  expect(disabled.container.textContent).toBe('');
  disabled.unmount();
  feature.enabled = true;
  feature.configured = false;
  const unconfigured = renderUi(<AccountLinks />);
  expect(unconfigured.container.querySelector('a')?.textContent).toBe('Log in');
  unconfigured.unmount();
});
test('configured navigation and pages load their Firebase components', async () => {
  const ui = renderUi(
    <FirebaseRuntime config={config}>
      <AccountLinks />
      <AuthPage page="login" />
    </FirebaseRuntime>,
  );
  await act(async () => {
    await import('./FirebaseAccount');
    await import('./FirebaseForms');
  });
  act(() => client.subscribe.mock.calls[0]?.[0](null));
  expect(ui.container.querySelector('a.account-login')?.textContent).toBe(
    'Log in',
  );
  expect(ui.container.querySelector('form')).not.toBeNull();
  ui.unmount();
});
