import type { ReactNode } from 'react';

export function HandoffTable(props: { children?: ReactNode }) {
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
