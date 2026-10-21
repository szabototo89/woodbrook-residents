import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

export function renderUi(node: ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  return {
    container,
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

export function getButtonByName(container: ParentNode, name: string) {
  const match = Array.from(container.querySelectorAll('button')).find(
    (button) =>
      button.textContent?.trim() === name ||
      button.getAttribute('aria-label') === name,
  );
  if (!match) {
    throw new Error(`Expected a button named "${name}"`);
  }
  return match;
}

export function click(element: Element) {
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

export function typeInto(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  act(() => {
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

export function selectOption(select: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype,
    'value',
  )?.set;
  act(() => {
    setter?.call(select, value);
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
