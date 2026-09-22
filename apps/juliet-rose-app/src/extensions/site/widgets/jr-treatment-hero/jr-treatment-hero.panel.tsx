import {
  TextSettingsPanel,
  type TextSettingField,
} from '../../widget-panel/TextSettingsPanel';

const FIELDS: readonly TextSettingField[] = [
  { key: 'eyebrow', label: 'Eyebrow' },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'script-first-line', label: 'Script first line' },
  { key: 'script-second-line', label: 'Script second line' },
  { key: 'script-third-line', label: 'Script third line' },
  { key: 'image-url', label: 'Background image URL' },
];

export default function TreatmentHeroPanel() {
  return (
    <TextSettingsPanel
      dataHookPrefix="jr-treatment-hero-panel"
      fields={FIELDS}
    />
  );
}
