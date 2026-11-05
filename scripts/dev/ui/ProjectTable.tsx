import type { ProjectView } from '../types';
import { ProjectRow } from './ProjectRow';

export type ProjectTableProps = {
  readonly projects: readonly ProjectView[];
  readonly selectedId: string | undefined;
  readonly maxRows: number;
  readonly width: number;
};

export function ProjectTable(props: ProjectTableProps) {
  const selectedIndex = Math.max(
    0,
    props.projects.findIndex((project) => project.id === props.selectedId),
  );
  const visibleRows = Math.max(
    1,
    Math.min(props.maxRows, props.projects.length),
  );
  const start = Math.max(
    0,
    Math.min(
      selectedIndex - Math.floor(visibleRows / 2),
      props.projects.length - visibleRows,
    ),
  );
  const visible = props.projects.slice(start, start + visibleRows);

  return (
    <box
      border
      borderColor="#30363d"
      title={`Projects ${start + 1}-${start + visible.length} of ${props.projects.length}`}
      flexDirection="column"
      flexShrink={0}
    >
      {visible.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          selected={project.id === props.selectedId}
          width={props.width - 4}
        />
      ))}
    </box>
  );
}
