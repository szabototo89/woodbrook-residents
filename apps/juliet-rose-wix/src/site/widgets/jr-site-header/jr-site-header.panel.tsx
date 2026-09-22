import {
  TextSettingsPanel,
  type TextSettingField,
} from '../../widget-panel/TextSettingsPanel';

const FIELDS: readonly TextSettingField[] = [
  { key: 'active-navigation-item', label: 'Active page path' },
  { key: 'brand-title', label: 'Brand title' },
  { key: 'brand-subtitle', label: 'Brand subtitle' },
  { key: 'home-url', label: 'Home link' },
  { key: 'treatments-url', label: 'Treatments link' },
  { key: 'gift-cards-url', label: 'Gift cards link' },
  { key: 'contact-url', label: 'Contact link' },
  { key: 'booking-url', label: 'Booking link' },
  { key: 'booking-label', label: 'Booking label' },
];

export default function SiteHeaderPanel() {
  return (
    <TextSettingsPanel dataHookPrefix="jr-site-header-panel" fields={FIELDS} />
  );
}
