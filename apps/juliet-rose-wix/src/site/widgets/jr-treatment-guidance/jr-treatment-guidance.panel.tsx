import { widget } from '@wix/editor';
import {
  FormField,
  Input,
  SidePanel,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { useEffect, useState } from 'react';

const KEY = 'contact-url';

export default function JrTreatmentGuidancePanel() {
  const [value, setValue] = useState('');

  useEffect(() => {
    async function loadProp() {
      setValue((await widget.getProp(KEY)) ?? '');
    }
    void loadProp();
  }, []);

  async function handleChange(next: string) {
    setValue(next);
    await widget.setProp(KEY, next);
  }

  return (
    <WixDesignSystemProvider>
      <SidePanel>
        <SidePanel.Content>
          <FormField label="Contact link">
            <Input
              dataHook="jr-treatment-guidance-panel-contact-url"
              value={value}
              onChange={(event) => {
                void handleChange(event.target.value);
              }}
            />
          </FormField>
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
}
