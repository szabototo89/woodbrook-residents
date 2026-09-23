import { Input, InputArea } from '@wix/design-system';
import '@wix/design-system/styles.global.css';

import type { PanelField } from './panelFields';

type PanelFieldInputProps = Readonly<{
  prefix: string;
  field: PanelField;
  value: string;
  onSave: (value: string) => void;
}>;

export function PanelFieldInput(props: PanelFieldInputProps) {
  const dataHook = `${props.prefix}-${props.field.key}`;
  if (props.field.kind === 'longText') {
    return (
      <InputArea
        dataHook={dataHook}
        value={props.value}
        placeholder={props.field.placeholder}
        onChange={(event) => {
          props.onSave(event.target.value);
        }}
      />
    );
  }
  if (props.field.kind === 'choice') {
    // Wix DS Dropdown bundles an older React copy incompatible with this
    // app's React 19 runtime, so a styled native select keeps full-width
    // DS-like layout without breaking panel rendering.
    return (
      <select
        data-hook={dataHook}
        aria-label={props.field.label}
        value={props.value}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          font: 'inherit',
          padding: '8px 12px',
          border: '1px solid #c9c9c9',
          borderRadius: '6px',
          backgroundColor: '#fff',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        onChange={(event) => {
          props.onSave(event.target.value);
        }}
      >
        {(props.field.options ?? []).map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>
    );
  }
  return (
    <Input
      dataHook={dataHook}
      value={props.value}
      placeholder={props.field.placeholder}
      onChange={(event) => {
        props.onSave(event.target.value);
      }}
    />
  );
}
