export type DevManagerHeaderProps = {
  readonly runningCount: number;
  readonly failedCount: number;
  readonly total: number;
};

export function DevManagerHeader(props: DevManagerHeaderProps) {
  return (
    <box flexDirection="row" justifyContent="space-between">
      <text fg="#58a6ff">Woodbrook dev manager</text>
      <text fg="#8b949e">
        {`${props.runningCount}/${props.total} running`}
        {props.failedCount > 0 ? ` · ${props.failedCount} failed` : ''}
      </text>
    </box>
  );
}
