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
    return (
      <select
        data-hook={dataHook}
        aria-label={props.field.label}
        value={props.value}
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
