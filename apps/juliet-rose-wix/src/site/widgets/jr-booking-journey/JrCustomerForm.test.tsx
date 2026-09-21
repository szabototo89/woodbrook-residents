import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { JrCustomerForm } from './JrCustomerForm';

function fillName(view: { container: HTMLElement }, value: string) {
  const field =
    view.container.querySelector<HTMLInputElement>('input[name="name"]')!;
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  setter?.call(field, value);
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

test('jr-customer-form submits valid details', async () => {
  const onSubmit = vi.fn();
  const view = renderUi(<JrCustomerForm onSubmit={onSubmit} />);
  await act(async () => {
    fillName(view, 'Diana');
    const email = view.container.querySelector<HTMLInputElement>(
      'input[name="email"]',
    )!;
    const emailSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;
    emailSetter?.call(email, 'diana@example.com');
    email.dispatchEvent(new Event('input', { bubbles: true }));
    const phone = view.container.querySelector<HTMLInputElement>(
      'input[name="phone"]',
    )!;
    const phoneSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;
    phoneSetter?.call(phone, '0851234567');
    phone.dispatchEvent(new Event('input', { bubbles: true }));
    view.container
      .querySelector('button[type="submit"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
  });

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'Diana',
    email: 'diana@example.com',
    phone: '0851234567',
    notes: '',
  });
  view.unmount();
});

test('jr-customer-form shows field errors instead of submitting', async () => {
  const onSubmit = vi.fn();
  const view = renderUi(<JrCustomerForm onSubmit={onSubmit} />);
  await act(async () => {
    view.container
      .querySelector('button[type="submit"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
  });

  expect(onSubmit).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('Enter your name');
  view.unmount();
});

test('jr-customer-form disables every control when the journey is incomplete', () => {
  const view = renderUi(<JrCustomerForm disabled onSubmit={() => {}} />);

  expect(
    view.container.querySelector<HTMLButtonElement>('button[type="submit"]')
      ?.disabled,
  ).toBe(true);
  expect(
    view.container.querySelector<HTMLInputElement>('input[name="name"]')
      ?.disabled,
  ).toBe(true);
  view.unmount();
});
