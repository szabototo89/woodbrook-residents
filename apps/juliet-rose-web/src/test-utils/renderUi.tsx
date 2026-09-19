import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

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
    (button) => button.textContent?.trim() === name,
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
