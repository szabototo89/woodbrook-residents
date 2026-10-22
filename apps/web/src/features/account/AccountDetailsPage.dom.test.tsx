// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
type TestState = {
  feature: {
    ready: boolean;
    enabled: boolean;
    configured: boolean;
    search: string;
  };
  session: {
    status: string;
    user: null | {
      uid: string;
      email: string;
      displayName: string;
      emailVerified: boolean;
    };
    actions: {
      loadDetails: ReturnType<typeof vi.fn>;
      saveDetails: ReturnType<typeof vi.fn>;
      removeDetails: ReturnType<typeof vi.fn>;
    };
  };
};
const state = vi.hoisted<TestState>(() => ({
  feature: {
    ready: true,
    enabled: true,
    configured: true,
    search: '?feature_flag=firebase-auth',
  },
  session: {
    status: 'ready',
    user: null,
    actions: {
      loadDetails: vi.fn(),
      saveDetails: vi.fn(),
      removeDetails: vi.fn(),
    },
  },
}));
vi.mock('../auth/AuthProvider', () => ({
  useAuthFeature: () => state.feature,
}));
vi.mock('../auth/AuthSession', () => ({ useAuthSession: () => state.session }));
import { AccountDetailsPage } from './AccountDetailsPage';
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  Object.assign(state.feature, {
    ready: true,
    enabled: true,
    configured: true,
  });
  state.session.status = 'ready';
  state.session.user = null;
  vi.resetAllMocks();
  state.session.actions.loadDetails.mockResolvedValue(null);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
const render = () => act(async () => root.render(<AccountDetailsPage />));

test('direct account URLs respect feature availability and signed-out visitors never load private data', async () => {
  state.feature.ready = false;
  await render();
  expect(container.textContent).toContain('Loading account');
  state.feature.ready = true;
  state.feature.enabled = false;
  await render();
  expect(container.textContent).toContain('Accounts are not enabled');
  state.feature.enabled = true;
  state.feature.configured = false;
  await render();
  expect(container.textContent).toContain('Account access is being set up');
  state.feature.configured = true;
  await render();
  expect(container.textContent).toContain('Log in to manage your details');
  expect(
    container.querySelector('a[href="/login?feature_flag=firebase-auth"]'),
  ).not.toBeNull();
  expect(state.session.actions.loadDetails).not.toHaveBeenCalled();
  state.session.status = 'loading';
  await render();
  expect(container.textContent).toContain('Connecting');
  state.session.status = 'error';
  await render();
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    'temporarily unavailable',
  );
});

test('account switching ignores delayed reads from the previous resident and clears location on sign-out', async () => {
  const first = Promise.withResolvers<unknown>();
  state.session.user = {
    uid: 'one',
    email: 'one@example.com',
    displayName: 'Sample One',
    emailVerified: true,
  };
  state.session.actions.loadDetails
    .mockReturnValueOnce(first.promise)
    .mockResolvedValueOnce({ eircode: '', address: 'Second sample address' });
  await render();
  state.session.user = {
    ...state.session.user,
    uid: 'two',
    email: 'two@example.com',
  };
  await render();
  expect(
    container.querySelector<HTMLTextAreaElement>('[name="address"]')?.value,
  ).toBe('Second sample address');
  await act(async () =>
    first.resolve({
      eircode: 'A65 F4E2',
      address: 'First private sample address',
    }),
  );
  expect(
    container.querySelector<HTMLTextAreaElement>('[name="address"]')?.value,
  ).toBe('Second sample address');
  state.session.user = null;
  await render();
  expect(container.querySelector('[name="address"]')).toBeNull();
  expect(container.textContent).not.toContain('Second sample address');
});
