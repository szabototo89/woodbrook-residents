// @vitest-environment happy-dom

import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';
import { CustomerDetailsForm } from './CustomerDetailsForm';

function enterValue(input: HTMLInputElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

test('submits typed customer details through TanStack Form', async () => {
  const onSubmit = vi.fn();
  const view = renderUi(<CustomerDetailsForm onSubmit={onSubmit} />);

  enterValue(
    view.container.querySelector<HTMLInputElement>('[name="name"]')!,
    'Aoife Murphy',
  );
  enterValue(
    view.container.querySelector<HTMLInputElement>('[name="email"]')!,
    'aoife@example.com',
  );
  enterValue(
    view.container.querySelector<HTMLInputElement>('[name="phone"]')!,
    '085 123 4567',
  );

  await act(async () => {
    view.container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'Aoife Murphy',
    email: 'aoife@example.com',
    phone: '085 123 4567',
    notes: '',
  });
  view.unmount();
});

test('shows useful errors instead of submitting incomplete details', async () => {
  const onSubmit = vi.fn();
  const view = renderUi(<CustomerDetailsForm onSubmit={onSubmit} />);

  await act(async () => {
    view.container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(onSubmit).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('Enter your name');
  expect(view.container.textContent).toContain('Enter a valid email address');
  expect(view.container.textContent).toContain('Enter a phone number');
  view.unmount();
});

test('disables all customer fields until an appointment is selected', () => {
  const view = renderUi(<CustomerDetailsForm disabled onSubmit={vi.fn()} />);

  expect(
    Array.from(
      view.container.querySelectorAll<HTMLInputElement>(
        'input, textarea, button',
      ),
    ).every((control) => control.disabled),
  ).toBe(true);
  view.unmount();
});
