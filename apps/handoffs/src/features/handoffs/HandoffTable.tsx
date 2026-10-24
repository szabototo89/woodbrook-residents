import type { ReactNode } from 'react';

type HandoffTableProps = { children?: ReactNode };

export function HandoffTable(props: HandoffTableProps) {
  return (
    <div
      className="handoff-table"
      tabIndex={0}
      role="region"
      aria-label="Scrollable table"
    >
      <table>{props.children}</table>
    </div>
  );
}
