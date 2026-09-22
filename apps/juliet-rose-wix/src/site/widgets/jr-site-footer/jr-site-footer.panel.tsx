import {
  TextSettingsPanel,
  type TextSettingField,
} from '../../widget-panel/TextSettingsPanel';

const FIELDS: readonly TextSettingField[] = [
  { key: 'brand-title', label: 'Brand title' },
  { key: 'brand-subtitle', label: 'Brand subtitle' },
  { key: 'home-url', label: 'Home link' },
  { key: 'treatments-url', label: 'Treatments link' },
  { key: 'gift-cards-url', label: 'Gift cards link' },
  { key: 'contact-url', label: 'Contact link' },
  { key: 'instagram-url', label: 'Instagram URL' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'copyright', label: 'Copyright line' },
];

export default function SiteFooterPanel() {
  return (
    <TextSettingsPanel dataHookPrefix="jr-site-footer-panel" fields={FIELDS} />
  );
}
