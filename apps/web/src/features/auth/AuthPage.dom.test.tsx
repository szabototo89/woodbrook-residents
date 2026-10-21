// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';

const state = vi.hoisted(() => ({
  enabled: false,
  configured: false,
  ready: true,
  search: '',
}));
vi.mock('./AuthProvider', () => ({ useAuthFeature: () => state }));
import { AuthPage } from './AuthPage';

test('disabled account routes offer a return to the public hub without account forms', () => {
  const ui = renderUi(<AuthPage page="login" />);
  expect(ui.container.textContent).toContain('Accounts are not enabled');
  expect(ui.container.querySelector('a')?.getAttribute('href')).toBe('/');
  expect(ui.container.querySelector('form')).toBeNull();
  ui.unmount();
});

test.each([
  ['login', 'Welcome back'],
  ['register', 'Create your account'],
  ['forgot-password', 'Reset your password'],
] as const)(
  'enabled %s route shows its purpose and an honest setup state without a key',
  (page, heading) => {
    state.enabled = true;
    const ui = renderUi(<AuthPage page={page} />);
    expect(ui.container.querySelector('h1')?.textContent).toBe(heading);
    expect(ui.container.textContent).toContain(
      'Account access is being set up',
    );
    expect(ui.container.querySelector('form')).toBeNull();
    ui.unmount();
  },
);
