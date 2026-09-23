import {
  FormField,
  SidePanel,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

import { PanelFieldInput } from './PanelFieldInput';
import type { PanelSection } from './panelFields';
import { collectFieldKeys } from './panelFields';
import { usePanelProps } from './usePanelProps';

export type SettingsPanelProps = Readonly<{
  dataHookPrefix: string;
  title: string;
  subtitle?: string;
  sections: readonly PanelSection[];
}>;

export function SettingsPanel(props: SettingsPanelProps) {
  const keys = collectFieldKeys(props.sections);
  const panel = usePanelProps(keys);

  return (
    <WixDesignSystemProvider>
      <SidePanel>
        <SidePanel.Header title={props.title} subtitle={props.subtitle} />
        <SidePanel.Content>
          {panel.status === 'loading' ? <div>Loading settings…</div> : null}
          {panel.status === 'error' ? (
            <div role="alert">
              Could not load settings.{' '}
              {panel.error ?? 'Please reopen the panel.'}
            </div>
          ) : null}
          {panel.status === 'ready'
            ? props.sections.map((section, index) => (
                <div key={section.title}>
                  {index > 0 ? <SidePanel.Divider /> : null}
                  <SidePanel.Section title={section.title}>
                    {section.fields.map((field) => (
                      <FormField key={field.key} label={field.label}>
                        <PanelFieldInput
                          prefix={props.dataHookPrefix}
                          field={field}
                          value={panel.values[field.key] ?? ''}
                          onSave={(value) => {
                            void panel.save(field.key, value);
                          }}
                        />
                        {field.help ? (
                          <div
                            data-hook={`${props.dataHookPrefix}-${field.key}-help`}
                          >
                            {field.help}
                          </div>
                        ) : null}
                      </FormField>
                    ))}
                  </SidePanel.Section>
                </div>
              ))
            : null}
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
}
