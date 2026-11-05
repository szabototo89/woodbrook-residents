import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import type { InteractiveMount, InteractiveMountProps } from './interactive';
import { DevManagerApp } from './ui/DevManagerApp';

export const mountOpenTui: InteractiveMount = async (
  props: InteractiveMountProps,
) => {
  const renderer = await createCliRenderer({
    exitOnCtrlC: false,
    useMouse: false,
    autoFocus: true,
  });

  try {
    const root = createRoot(renderer);
    root.render(
      <DevManagerApp manager={props.manager} onQuit={props.onQuit} />,
    );
    return {
      destroy: () => {
        root.unmount();
        renderer.destroy();
      },
    };
  } catch (error) {
    renderer.destroy();
    throw error;
  }
};
