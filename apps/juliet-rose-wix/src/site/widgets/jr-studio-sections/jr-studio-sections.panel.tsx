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
  { key: 'gift-eyebrow', label: 'Gift eyebrow' },
  { key: 'gift-title', label: 'Gift title' },
  { key: 'gift-copy-lead', label: 'Gift copy first line' },
  { key: 'gift-copy-rest', label: 'Gift copy second line' },
  { key: 'gift-button-label', label: 'Gift button label' },
  { key: 'gift-card-url', label: 'Gift card link' },
  { key: 'visit-eyebrow', label: 'Visit eyebrow' },
  { key: 'visit-title', label: 'Visit title' },
  { key: 'address', label: 'Address' },
  { key: 'hours-days', label: 'Opening days' },
  { key: 'hours-time', label: 'Opening hours' },
  { key: 'phone-href', label: 'Phone link' },
  { key: 'phone-label', label: 'Phone label' },
  { key: 'email-href', label: 'Email link' },
  { key: 'email-label', label: 'Email label' },
  { key: 'contact-button-label', label: 'Contact button label' },
  { key: 'studio-image-url', label: 'Studio image URL' },
  { key: 'studio-image-alt', label: 'Studio image alt text' },
  { key: 'policy-eyebrow', label: 'Policy eyebrow' },
  { key: 'policy-title', label: 'Policy title' },
  { key: 'policy-copy', label: 'Policy copy' },
  { key: 'policy-full-url', label: 'Full policy link' },
  { key: 'policy-full-label', label: 'Full policy label' },
];

export default function StudioSectionsPanel() {
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
                dataHook={`jr-studio-sections-panel-${field.key}`}
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
