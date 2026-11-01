import { useKeyboard, useTerminalDimensions } from '@opentui/react';
import { useSyncExternalStore, useState } from 'react';
import type { DevController } from '../types';
import { DevManagerFooter } from './Footer';
import { DevManagerHeader } from './Header';
import { LogPanel } from './LogPanel';
import { ProjectTable } from './ProjectTable';

export type DevManagerAppProps = {
  readonly manager: DevController;
  readonly onQuit: () => void;
};

export function DevManagerApp(props: DevManagerAppProps) {
  const view = useSyncExternalStore(
    props.manager.subscribe,
    props.manager.getView,
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const dimensions = useTerminalDimensions();
  const selected =
    view.projects.find((project) => project.id === selectedId) ??
    view.projects.at(0);

  const moveSelection = (delta: number): void => {
    if (selected === undefined) return;
    const index = view.projects.findIndex(
      (project) => project.id === selected.id,
    );
    const nextIndex =
      (index + delta + view.projects.length) % view.projects.length;
    const next = view.projects.at(nextIndex);
    if (next !== undefined) setSelectedId(next.id);
  };

  useKeyboard((key) => {
    if (key.ctrl && key.name === 'c') {
      props.onQuit();
      return;
    }
    if (key.name === 'q') {
      props.onQuit();
      return;
    }
    if (key.name === 'up' || key.name === 'k') {
      moveSelection(-1);
      return;
    }
    if (key.name === 'down' || key.name === 'j') {
      moveSelection(1);
      return;
    }
    if (selected === undefined) return;
    if (key.name === 's' || key.name === 'return') {
      void props.manager.start(selected.id);
      return;
    }
    if (key.name === 'x') {
      void props.manager.stop(selected.id);
      return;
    }
    if (key.name === 'r') {
      void props.manager.restart(selected.id);
    }
  });

  const maxRows = Math.max(
    3,
    Math.min(view.projects.length, dimensions.height - 16),
  );
  const maxLogLines = Math.max(2, dimensions.height - maxRows - 12);

  return (
    <box flexDirection="column" flexGrow={1} padding={1} gap={1}>
      <DevManagerHeader
        runningCount={view.runningCount}
        failedCount={view.failedCount}
        total={view.projects.length}
      />
      <ProjectTable
        projects={view.projects}
        selectedId={selected?.id}
        maxRows={maxRows}
        width={dimensions.width}
      />
      <LogPanel
        project={selected}
        maxLines={maxLogLines}
        width={dimensions.width}
      />
      <DevManagerFooter />
    </box>
  );
}
