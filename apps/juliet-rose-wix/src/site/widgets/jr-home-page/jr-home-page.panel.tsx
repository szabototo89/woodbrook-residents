import {
  TextSettingsPanel,
  type TextSettingField,
} from '../../widget-panel/TextSettingsPanel';

const FIELDS: readonly TextSettingField[] = [
  { key: 'booking-base-url', label: 'Booking page link' },
  { key: 'treatments-url', label: 'Treatments page link' },
  { key: 'gift-card-url', label: 'Gift card page link' },
  { key: 'featured-slugs', label: 'Featured service slugs' },
  { key: 'phone-href', label: 'Phone link' },
  { key: 'email-href', label: 'Email link' },
  { key: 'hero-image-url', label: 'Hero image URL' },
  { key: 'studio-image-url', label: 'Studio image URL' },
];

export default function HomePagePanel() {
  return (
    <TextSettingsPanel dataHookPrefix="jr-home-page-panel" fields={FIELDS} />
  );
}
