// @vitest-environment happy-dom
import { act } from 'react';
import { expect, test, vi, beforeEach } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';

const clerk = vi.hoisted(() => ({
  status: 'needs_identifier',
  create: vi.fn(),
  resetPasswordEmailCode: {
    sendCode: vi.fn(),
    verifyCode: vi.fn(),
    submitPassword: vi.fn(),
  },
  finalize: vi.fn(),
}));
vi.mock('@clerk/react', () => ({
  useSignIn: () => ({ signIn: clerk, fetchStatus: 'idle' }),
}));
vi.mock('./AuthProvider', () => ({
  useAuthFeature: () => ({ search: '?feature_flag=clerk-auth' }),
}));
import { ForgotPasswordForm } from './ForgotPasswordForm';

beforeEach(() => {
  vi.resetAllMocks();
  clerk.status = 'needs_identifier';
  clerk.create.mockResolvedValue({});
  clerk.resetPasswordEmailCode.sendCode.mockResolvedValue({});
  clerk.resetPasswordEmailCode.verifyCode.mockImplementation(async () => {
    clerk.status = 'needs_new_password';
    return {};
  });
  clerk.resetPasswordEmailCode.submitPassword.mockImplementation(async () => {
    clerk.status = 'complete';
    return {};
  });
  clerk.finalize.mockResolvedValue({});
});

async function submit(container: HTMLElement) {
  await act(async () => {
    container
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

function fill(container: HTMLElement, name: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(
    `input[name="${name}"]`,
  );
  if (!input) throw new Error(`Missing ${name}`);
  input.value = value;
}

test('password recovery sends a code, verifies it, then resets the password and finalizes the session', async () => {
  const ui = renderUi(<ForgotPasswordForm />);
  fill(ui.container, 'email', 'resident@example.com');
  await submit(ui.container);
  expect(clerk.create).toHaveBeenCalledWith({
    identifier: 'resident@example.com',
  });
  expect(clerk.resetPasswordEmailCode.sendCode).toHaveBeenCalledOnce();
  expect(ui.container.textContent).toContain('Check your email');
  fill(ui.container, 'code', '123456');
  await submit(ui.container);
  expect(clerk.resetPasswordEmailCode.verifyCode).toHaveBeenCalledWith({
    code: '123456',
  });
  fill(ui.container, 'password', 'a-long-new-password');
  fill(ui.container, 'confirmPassword', 'a-long-new-password');
  await submit(ui.container);
  expect(clerk.resetPasswordEmailCode.submitPassword).toHaveBeenCalledWith({
    password: 'a-long-new-password',
    signOutOfOtherSessions: true,
  });
  expect(clerk.finalize).toHaveBeenCalledOnce();
  ui.unmount();
});

test('password recovery displays provider errors and allows retrying without advancing', async () => {
  clerk.create.mockResolvedValue({
    error: { message: 'Unable to send a reset code. Try again.' },
  });
  const ui = renderUi(<ForgotPasswordForm />);
  fill(ui.container, 'email', 'resident@example.com');
  await submit(ui.container);
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
    'Unable to send a reset code',
  );
  expect(clerk.resetPasswordEmailCode.sendCode).not.toHaveBeenCalled();
  expect(ui.container.querySelector('input[name="email"]')).not.toBeNull();
  ui.unmount();
});

test('password recovery rejects mismatched passwords before contacting Clerk', async () => {
  const ui = renderUi(<ForgotPasswordForm />);
  await submit(ui.container);
  await submit(ui.container);
  fill(ui.container, 'password', 'one-password');
  fill(ui.container, 'confirmPassword', 'another-password');
  await submit(ui.container);
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
    'Passwords do not match',
  );
  expect(clerk.resetPasswordEmailCode.submitPassword).not.toHaveBeenCalled();
  ui.unmount();
});

test('reset delivery and verification failures keep the relevant form available', async () => {
  clerk.resetPasswordEmailCode.sendCode.mockResolvedValueOnce({
    error: { message: 'Email delivery failed' },
  });
  const ui = renderUi(<ForgotPasswordForm />);
  await submit(ui.container);
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toBe(
    'Email delivery failed',
  );
  await submit(ui.container);
  clerk.resetPasswordEmailCode.verifyCode.mockResolvedValueOnce({
    error: { message: 'Incorrect reset code' },
  });
  await submit(ui.container);
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toBe(
    'Incorrect reset code',
  );
  expect(ui.container.querySelector('input[name="code"]')).not.toBeNull();
  ui.unmount();
});

test('password update and session errors are visible and allow retrying', async () => {
  const ui = renderUi(<ForgotPasswordForm />);
  await submit(ui.container);
  await submit(ui.container);
  fill(ui.container, 'password', 'matching-password');
  fill(ui.container, 'confirmPassword', 'matching-password');
  clerk.resetPasswordEmailCode.submitPassword.mockResolvedValueOnce({
    error: { message: 'Choose a stronger password' },
  });
  await submit(ui.container);
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toBe(
    'Choose a stronger password',
  );
  clerk.finalize.mockResolvedValueOnce({
    error: { message: 'Could not start session' },
  });
  await submit(ui.container);
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toBe(
    'Could not start session',
  );
  ui.unmount();
});

test('recovery offers login for additional security checks and lets users request another code', async () => {
  const ui = renderUi(<ForgotPasswordForm />);
  await submit(ui.container);
  const retry = ui.container.querySelector<HTMLButtonElement>(
    'button[type="button"]',
  );
  await act(async () => {
    retry?.click();
  });
  expect(ui.container.querySelector('input[name="email"]')).not.toBeNull();
  await submit(ui.container);
  await submit(ui.container);
  clerk.resetPasswordEmailCode.submitPassword.mockImplementationOnce(
    async () => {
      clerk.status = 'needs_second_factor';
      return {};
    },
  );
  await submit(ui.container);
  expect(ui.container.textContent).toContain('Password updated');
  expect(ui.container.querySelector('a')?.getAttribute('href')).toBe(
    '/login?feature_flag=clerk-auth',
  );
  ui.unmount();
});

test.each([false, true])(
  'session completion navigates safely with pending task %s',
  async (hasTask) => {
    const navigate = vi
      .spyOn(window.location, 'assign')
      .mockImplementation(() => {});
    clerk.finalize.mockImplementationOnce(async (options) => {
      options.navigate({
        session: hasTask ? { currentTask: { key: 'setup-mfa' } } : undefined,
      });
      return {};
    });
    const ui = renderUi(<ForgotPasswordForm />);
    await submit(ui.container);
    await submit(ui.container);
    await submit(ui.container);
    expect(navigate).toHaveBeenCalledWith(
      hasTask ? '/login?feature_flag=clerk-auth' : '/?feature_flag=clerk-auth',
    );
    navigate.mockRestore();
    ui.unmount();
  },
);

test('network failures give a retry message and duplicate submissions send only one request', async () => {
  const pending = Promise.withResolvers<object>();
  clerk.create.mockReturnValueOnce(pending.promise);
  const ui = renderUi(<ForgotPasswordForm />);
  await submit(ui.container);
  await submit(ui.container);
  expect(clerk.create).toHaveBeenCalledOnce();
  await act(async () => {
    pending.reject(null);
  });
  expect(ui.container.querySelector('[role="alert"]')?.textContent).toContain(
    'Please try again',
  );
  ui.unmount();
});
