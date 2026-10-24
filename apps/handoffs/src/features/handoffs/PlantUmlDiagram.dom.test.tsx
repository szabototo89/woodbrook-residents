// @vitest-environment happy-dom
import { act, type ReactNode } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import { click, renderUi } from '../../test-utils/renderUi';
import { PlantUmlDiagram } from './PlantUmlDiagram';

const controls = vi.hoisted(() => ({
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  fitToView: vi.fn(),
}));
type TransformWrapperProps = {
  children: (value: typeof controls) => ReactNode;
};

type TransformComponentProps = { children: ReactNode };

vi.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: (props: TransformWrapperProps) => props.children(controls),
  TransformComponent: (props: TransformComponentProps) => (
    <div>{props.children}</div>
  ),
}));
beforeEach(() => vi.clearAllMocks());

const source = '@startuml\n!include <C4/C4_Context>\n@enduml';

test('PlantUML displays a local SVG with an accessible title, full-size link and source', () => {
  const view = renderUi(
    <PlantUmlDiagram
      title="System context"
      image="/context.svg"
      source={source}
    />,
  );

  expect(view.container.querySelector('summary')?.textContent).toBe(
    'View diagram',
  );
  const image = view.container.querySelector('img');
  expect(image?.getAttribute('alt')).toBe(
    'System context — C4 architecture diagram',
  );
  expect(image?.getAttribute('src')).toBe('/context.svg');
  const link = view.container.querySelector('a');
  expect(link?.textContent).toBe('Open full size');
  expect(link?.getAttribute('href')).toBe('/context.svg');
  expect(link?.getAttribute('target')).toBe('_blank');
  expect(view.container.querySelector('code')?.textContent).toBe(source);
  view.unmount();
});

test('compact labeled controls forward zoom and fit actions to the diagram viewer', () => {
  const view = renderUi(
    <PlantUmlDiagram
      title="System context"
      image="/context.svg"
      source={source}
    />,
  );
  click(view.container.querySelector('button[aria-label="Zoom in"]')!);
  click(view.container.querySelector('button[aria-label="Zoom out"]')!);
  click(view.container.querySelector('button[aria-label="Fit diagram"]')!);
  expect(controls.zoomIn).toHaveBeenCalledWith(0.3, 0);
  expect(controls.zoomOut).toHaveBeenCalledWith(0.3, 0);
  expect(controls.fitToView).toHaveBeenCalledWith({ animationTime: 0 });
  view.unmount();
});

test('an unavailable SVG explains the failure and keeps the PlantUML source readable', () => {
  const view = renderUi(
    <PlantUmlDiagram
      title="System context"
      image="/missing.svg"
      source={source}
    />,
  );
  act(() =>
    view.container.querySelector('img')!.dispatchEvent(new Event('error')),
  );

  expect(
    view.container.querySelector('[role="status"]')?.textContent,
  ).toContain('Diagram could not be loaded');
  expect(view.container.querySelector('img')).toBeNull();
  expect(view.container.querySelector('code')?.textContent).toBe(source);
  view.unmount();
});
