import {
  TextSettingsPanel,
  type TextSettingField,
} from '../../widget-panel/TextSettingsPanel';

const FIELDS: readonly TextSettingField[] = [
  { key: 'gift-card-url', label: 'Gift card link' },
  { key: 'phone-href', label: 'Phone link' },
  { key: 'phone-label', label: 'Phone label' },
  { key: 'email-href', label: 'Email link' },
  { key: 'email-label', label: 'Email label' },
  { key: 'studio-image-url', label: 'Studio image URL' },
  { key: 'studio-image-alt', label: 'Studio image alt text' },
  { key: 'policy-url', label: 'Full policy link' },
];

export default function StudioSectionsPanel() {
  return (
    <TextSettingsPanel
      dataHookPrefix="jr-studio-sections-panel"
      fields={FIELDS}
    />
  );
}
