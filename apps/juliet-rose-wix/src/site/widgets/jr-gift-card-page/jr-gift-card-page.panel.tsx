import {
  TextSettingsPanel,
  type TextSettingField,
} from '../../widget-panel/TextSettingsPanel';

const FIELDS: readonly TextSettingField[] = [
  { key: 'checkout-url', label: 'Checkout link' },
  { key: 'image-url', label: 'Gift image URL' },
  { key: 'image-alt', label: 'Gift image alt text' },
  { key: 'phone-href', label: 'Phone link' },
  { key: 'phone-label', label: 'Phone label' },
  { key: 'email-href', label: 'Email link' },
  { key: 'email-label', label: 'Email label' },
];

export default function GiftCardPagePanel() {
  return (
    <TextSettingsPanel
      dataHookPrefix="jr-gift-card-page-panel"
      fields={FIELDS}
    />
  );
}
