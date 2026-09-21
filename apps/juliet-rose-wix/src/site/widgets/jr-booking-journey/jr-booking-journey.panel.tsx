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
  { key: 'initial-service', label: 'Preselected service slug' },
  { key: 'today', label: 'Today override (YYYY-MM-DD)' },
];

export default function JrBookingJourneyPanel() {
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
                dataHook={`jr-booking-journey-panel-${field.key}`}
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
