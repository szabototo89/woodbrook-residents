import type { HandoffMetadataValue } from './handoffs';

export function HandoffMetadata(props: { metadata: HandoffMetadataValue }) {
  const fields = [
    { label: 'Status', value: props.metadata.status },
    { label: 'Branch', value: props.metadata.branch },
    { label: 'Recorded HEAD', value: props.metadata.commit },
    {
      label: 'Updated (UTC)',
      value: props.metadata.updatedAt ? (
        <time dateTime={props.metadata.updatedAt}>
          {props.metadata.updatedAt}
        </time>
      ) : undefined,
    },
    { label: 'Worktree', value: props.metadata.worktree },
  ];
  return (
    <dl className="handoff-metadata">
      {fields.map((field) => (
        <div key={field.label}>
          <dt>{field.label}</dt>
          <dd>{field.value ?? 'Not recorded'}</dd>
        </div>
      ))}
    </dl>
  );
}
