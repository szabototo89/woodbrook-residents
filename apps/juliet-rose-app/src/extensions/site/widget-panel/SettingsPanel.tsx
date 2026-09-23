import {
  Box,
  FormField,
  SidePanel,
  Text,
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
      <SidePanel width="100%">
        <SidePanel.Header title={props.title} subtitle={props.subtitle} />
        <SidePanel.Content>
          <div
            data-hook="jr-panel-layout-root"
            style={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflowX: 'hidden',
            }}
          >
            {panel.status === 'loading' ? (
              <Text size="small" secondary>
                Loading settings…
              </Text>
            ) : null}
            {panel.status === 'error' ? (
              <div role="alert">
                <Text size="small" secondary>
                  Could not load settings.{' '}
                  {panel.error ?? 'Please reopen the panel.'}
                </Text>
              </div>
            ) : null}
            {panel.status === 'ready'
              ? props.sections.map((section, index) => (
                  <div key={section.title}>
                    {index > 0 ? <SidePanel.Divider /> : null}
                    <SidePanel.Section title={section.title}>
                      {section.fields.map((field) => (
                        <SidePanel.Field
                          key={field.key}
                          dataHook={`${props.dataHookPrefix}-field-${field.key}`}
                        >
                          <Box
                            direction="vertical"
                            gap="6px"
                            width="100%"
                            maxWidth="100%"
                          >
                            <FormField
                              label={field.label}
                              labelPlacement="top"
                              stretchContent
                            >
                              <PanelFieldInput
                                prefix={props.dataHookPrefix}
                                field={field}
                                value={panel.values[field.key] ?? ''}
                                onSave={(value) => {
                                  void panel.save(field.key, value);
                                }}
                              />
                            </FormField>
                            {field.help ? (
                              <Text
                                size="small"
                                secondary
                                dataHook={`${props.dataHookPrefix}-${field.key}-help`}
                              >
                                {field.help}
                              </Text>
                            ) : null}
                          </Box>
                        </SidePanel.Field>
                      ))}
                    </SidePanel.Section>
                  </div>
                ))
              : null}
          </div>
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
}
