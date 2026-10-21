// @vitest-environment happy-dom
import { act } from 'react';
import { expect, test, vi } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';
import { HandoffViewer } from './HandoffViewer';

vi.mock('./PlantUmlDiagram', () => ({
  PlantUmlDiagram: () => <p>Architecture diagram</p>,
}));

test('the standalone viewer navigates between its index, a handoff and missing documents', () => {
  window.history.replaceState(null, '', '/');
  const view = renderUi(<HandoffViewer />);
  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Agent handoffs',
  );
  act(() => {
    window.history.replaceState(null, '', '/#/agent-handoffs');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Browseable agent handoffs',
  );
  act(() => {
    window.history.replaceState(null, '', '/#/missing');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(view.container.querySelector('h1')?.textContent).toBe(
    'Handoff not found',
  );
  expect(view.container.querySelector('main a')?.getAttribute('href')).toBe(
    '#/',
  );
  view.unmount();
  window.history.replaceState(null, '', '/');
});
