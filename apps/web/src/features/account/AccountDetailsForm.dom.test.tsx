// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, expect, test, vi } from 'vitest';
import { AccountDetailsForm } from './AccountDetailsForm';

let root: Root;
let container: HTMLDivElement;
const actions = () => ({
  loadDetails: vi.fn().mockResolvedValue(null),
  saveDetails: vi.fn().mockResolvedValue(undefined),
  removeDetails: vi.fn().mockResolvedValue(undefined),
});
async function render(client = actions()) {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<AccountDetailsForm actions={client} />));
  return client;
}
function input(name: string, value: string) {
  const field = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[name="${name}"]`,
  )!;
  const prototype =
    field.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(field, value);
  field.dispatchEvent(new Event('input', { bubbles: true }));
}
afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
});

test('loads private details, saves normalized fields and announces success', async () => {
  const client = actions();
  client.loadDetails.mockResolvedValue({
    eircode: 'A65 F4E2',
    address: 'Sample address',
  });
  await render(client);
  expect(
    container.querySelector<HTMLInputElement>('[name="eircode"]')!.value,
  ).toBe('A65 F4E2');
  await act(async () => {
    input('eircode', 'd6wab12');
    input('address', ' Updated sample address ');
  });
  await act(async () =>
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
  );
  expect(client.saveDetails).toHaveBeenCalledWith({
    eircode: 'D6W AB12',
    address: 'Updated sample address',
  });
  expect(container.querySelector('[role="status"]')?.textContent).toContain(
    'saved',
  );
  expect(container.querySelector('[data-clarity-mask="true"]')).not.toBeNull();
});

test('failed loads prevent overwriting existing details and can be retried', async () => {
  const client = actions();
  client.loadDetails.mockRejectedValueOnce(new Error('private server detail'));
  await render(client);
  expect(container.querySelector('[role="alert"]')?.textContent).not.toContain(
    'private server detail',
  );
  expect(container.querySelector('fieldset')?.disabled ?? true).toBe(true);
  const retry = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === 'Try again',
  )!;
  await act(async () => retry.click());
  expect(client.loadDetails).toHaveBeenCalledTimes(2);
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

test('rejects invalid input, preserves edits on failed saves, and removes saved details', async () => {
  const client = await render();
  await act(async () => input('eircode', 'bad'));
  const submit = () =>
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  await act(async () => {
    submit();
  });
  expect(client.saveDetails).not.toHaveBeenCalled();
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    'format',
  );
  client.saveDetails.mockRejectedValueOnce(new Error('private failure'));
  await act(async () => {
    input('eircode', '');
    input('address', 'Sample address');
  });
  await act(async () => {
    submit();
  });
  expect(
    container.querySelector<HTMLTextAreaElement>('[name="address"]')!.value,
  ).toBe('Sample address');
  expect(container.querySelector('[role="alert"]')?.textContent).not.toContain(
    'private failure',
  );
  await act(async () => {
    submit();
  });
  const remove = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === 'Remove saved location',
  )!;
  await act(async () => remove.click());
  expect(client.removeDetails).toHaveBeenCalledOnce();
  expect(
    container.querySelector<HTMLTextAreaElement>('[name="address"]')!.value,
  ).toBe('');
});

test('shows unsaved edits and discards them without writing to the account', async () => {
  const client = actions();
  client.loadDetails.mockResolvedValue({
    eircode: 'A65 F4E2',
    address: 'Saved sample address',
  });
  await render(client);
  await act(async () => input('address', 'Unsaved sample address'));
  expect(container.textContent).toContain('Unsaved changes');
  const discard = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === 'Discard changes',
  )!;
  await act(async () => discard.click());
  expect(
    container.querySelector<HTMLTextAreaElement>('[name="address"]')!.value,
  ).toBe('Saved sample address');
  expect(container.textContent).not.toContain('Unsaved changes');
  expect(client.saveDetails).not.toHaveBeenCalled();
});

test('only offers removal for saved details and focuses an invalid Eircode', async () => {
  await render();
  expect(container.textContent).not.toContain('Remove saved location');
  await act(async () => input('eircode', 'bad'));
  await act(async () =>
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
  );
  const field = container.querySelector<HTMLInputElement>('[name="eircode"]')!;
  expect(field.getAttribute('aria-invalid')).toBe('true');
  expect(document.activeElement).toBe(field);
  expect(field.getAttribute('aria-describedby')).toContain('location-error');
});

test('removing a saved location clears validation errors from unsaved edits', async () => {
  const client = actions();
  client.loadDetails.mockResolvedValue({ eircode: 'A65 F4E2', address: '' });
  await render(client);
  await act(async () => input('eircode', 'bad'));
  await act(async () =>
    container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
  );
  const remove = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === 'Remove saved location',
  )!;
  await act(async () => remove.click());
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(
    container.querySelector('[name="eircode"]')!.hasAttribute('aria-invalid'),
  ).toBe(false);
});
