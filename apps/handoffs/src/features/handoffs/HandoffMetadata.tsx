import {
  CircleDot,
  Clock3,
  FolderOpen,
  GitBranch,
  GitCommitHorizontal,
} from 'lucide-react';
import type { HandoffMetadataValue } from './handoffs';

export function HandoffMetadata(props: { metadata: HandoffMetadataValue }) {
  const fields = [
    { label: 'Status', value: props.metadata.status, Icon: CircleDot },
    { label: 'Branch', value: props.metadata.branch, Icon: GitBranch },
    {
      label: 'Recorded HEAD',
      value: props.metadata.commit,
      Icon: GitCommitHorizontal,
    },
    {
      label: 'Updated (UTC)',
      value: props.metadata.updatedAt ? (
        <time dateTime={props.metadata.updatedAt}>
          {props.metadata.updatedAt}
        </time>
      ) : undefined,
      Icon: Clock3,
    },
    { label: 'Worktree', value: props.metadata.worktree, Icon: FolderOpen },
  ];
  return (
    <dl className="handoff-metadata">
      {fields.map((field) => (
        <div key={field.label}>
          <dt>
            <field.Icon size={11} aria-hidden="true" />
            {field.label}
          </dt>
          <dd>{field.value ?? 'Not recorded'}</dd>
        </div>
      ))}
    </dl>
  );
}
