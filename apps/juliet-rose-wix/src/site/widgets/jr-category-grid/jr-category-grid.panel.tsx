import { widget } from '@wix/editor';
import {
  FormField,
  Input,
  SidePanel,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { useEffect, useState } from 'react';

type PanelField = Readonly<{
  key: string;
  label: string;
}>;

const FIELDS: readonly PanelField[] = [
  { key: 'view-all-label', label: 'View-all label' },
  { key: 'view-all-href', label: 'View-all link' },
];

export default function JrCategoryGridPanel() {
  const [values, setValues] = useState<Readonly<Record<string, string>>>({});

  useEffect(() => {
    async function loadProps() {
      const entries = await Promise.all(
        FIELDS.map(async (field) => {
          const value = await widget.getProp(field.key);
          return [field.key, value ?? ''] as const;
        }),
      );
      setValues(Object.fromEntries(entries));
    }
    void loadProps();
  }, []);

  async function handleChange(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    await widget.setProp(key, value);
  }

  return (
    <WixDesignSystemProvider>
      <SidePanel>
        <SidePanel.Content>
          {FIELDS.map((field) => (
            <FormField key={field.key} label={field.label}>
              <Input
                dataHook={`jr-category-grid-panel-${field.key}`}
                value={values[field.key] ?? ''}
                onChange={(event) => {
                  void handleChange(field.key, event.target.value);
                }}
              />
            </FormField>
          ))}
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
}
