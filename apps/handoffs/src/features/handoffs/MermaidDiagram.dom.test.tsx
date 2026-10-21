// @vitest-environment happy-dom
import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import { renderUi } from '../../test-utils/renderUi';
import { MermaidDiagram } from './MermaidDiagram';

const renderer = vi.hoisted(() => ({ initialize: vi.fn(), render: vi.fn() }));
vi.mock('mermaid', () => ({ default: renderer }));

beforeEach(() => vi.resetAllMocks());

test('Mermaid renders C4 into an accessible figure and keeps its source available', async () => {
  renderer.render.mockResolvedValue({
    svg: '<svg><text>System context</text></svg>',
  });
  const view = renderUi(<MermaidDiagram source="C4Context" />);
  await act(async () => {
    await vi.waitFor(() => expect(renderer.render).toHaveBeenCalled());
  });
  expect(
    view.container.querySelector('[role="img"]')?.getAttribute('aria-label'),
  ).toBe('C4 architecture diagram');
  expect(view.container.querySelector('svg')?.textContent).toBe(
    'System context',
  );
  expect(view.container.querySelector('details')?.textContent).toContain(
    'C4Context',
  );
  expect(renderer.initialize).toHaveBeenCalledWith(
    expect.objectContaining({ securityLevel: 'strict' }),
  );
  view.unmount();
});

test('invalid diagram source has a readable error and retains the original source', async () => {
  renderer.render.mockRejectedValue(new Error('Invalid Mermaid'));
  const view = renderUi(<MermaidDiagram source="invalid" />);
  await act(async () => {
    await vi.waitFor(() => expect(renderer.render).toHaveBeenCalled());
  });
  expect(
    view.container.querySelector('[role="status"]')?.textContent,
  ).toContain('could not be rendered');
  expect(view.container.querySelector('code')?.textContent).toBe('invalid');
  view.unmount();
});

test.each(['resolve', 'reject'])(
  'a diagram can unmount while the renderer is pending (%s)',
  async (outcome) => {
    const pending = Promise.withResolvers<{ svg: string }>();
    renderer.render.mockReturnValue(pending.promise);
    const view = renderUi(<MermaidDiagram source="C4Context" />);
    await act(async () => {
      await vi.waitFor(() => expect(renderer.render).toHaveBeenCalled());
    });
    view.unmount();
    await act(async () => {
      if (outcome === 'resolve') pending.resolve({ svg: '<svg />' });
      else pending.reject(new Error('Stopped'));
      await Promise.resolve();
    });
    expect(view.container.querySelector('svg')).toBeNull();
  },
);
