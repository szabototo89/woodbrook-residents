import type { ProjectView } from '../types';
import { formatTime, truncate } from './format';

export type LogPanelProps = {
  readonly project: ProjectView | undefined;
  readonly maxLines: number;
  readonly width: number;
};

export function LogPanel(props: LogPanelProps) {
  if (props.project === undefined) {
    return (
      <box border borderColor="#30363d" title="Logs" flexGrow={1}>
        <text fg="#8b949e">No project selected.</text>
      </box>
    );
  }

  const logs = props.project.logs.slice(-Math.max(0, props.maxLines));

  return (
    <box
      border
      borderColor="#30363d"
      title={`Logs - ${props.project.label} (${props.project.logs.length} lines)`}
      flexDirection="column"
      flexGrow={1}
    >
      {logs.length === 0 ? (
        <text fg="#8b949e">No output yet.</text>
      ) : (
        logs.map((line, index) => (
          <text
            key={`${line.at}-${index}`}
            fg={line.stream === 'stderr' ? '#f85149' : '#c9d1d9'}
          >
            {truncate(
              `${formatTime(line.at)} ${line.text}`,
              Math.max(1, props.width - 6),
            )}
          </text>
        ))
      )}
    </box>
  );
}
