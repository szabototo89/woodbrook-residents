import type { ProjectView } from '../types';
import { padEnd, projectStatusColor, truncate } from './format';

export type ProjectRowProps = {
  readonly project: ProjectView;
  readonly selected: boolean;
  readonly width: number;
};

export function ProjectRow(props: ProjectRowProps) {
  const ports = props.project.ports.join(',');
  const error =
    props.project.error === undefined ? '' : `  ${props.project.error}`;
  const row = `${props.selected ? '>' : ' '} ${padEnd(props.project.status, 8)} ${padEnd(
    props.project.label,
    24,
  )} ${padEnd(props.project.url, 26)} ${padEnd(ports, 9)}${error}`;

  return (
    <text
      fg={projectStatusColor(props.project.status)}
      bg={props.selected ? '#1f2d3d' : undefined}
    >
      {truncate(row, props.width)}
    </text>
  );
}
