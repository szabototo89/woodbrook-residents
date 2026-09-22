import {
  TextSettingsPanel,
  type TextSettingField,
} from '../../widget-panel/TextSettingsPanel';

const FIELDS: readonly TextSettingField[] = [
  { key: 'booking-base-url', label: 'Booking page link' },
  { key: 'contact-url', label: 'Contact link' },
  { key: 'hero-eyebrow', label: 'Hero eyebrow' },
  { key: 'hero-title', label: 'Hero title' },
  { key: 'hero-description', label: 'Hero description' },
  { key: 'hero-image-url', label: 'Hero image URL' },
];

export default function TreatmentsPagePanel() {
  return (
    <TextSettingsPanel
      dataHookPrefix="jr-treatments-page-panel"
      fields={FIELDS}
    />
  );
}
