import { useContactPanelDefaults } from '../../contactDetails/useContactPanelDefaults';
import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import {
  bookingLinkField,
  contactField,
  imageField,
} from '../../widget-panel/sharedFields';

export default function GiftCardPagePanel() {
  const contactDefaults = useContactPanelDefaults();
  return (
    <SettingsPanel
      dataHookPrefix="jr-gift-card-page-panel"
      title="Gift card page settings"
      subtitle="Checkout link, imagery and contact details"
      defaults={contactDefaults}
      sections={[
        {
          title: 'Links',
          fields: [bookingLinkField('checkout-url')],
        },
        {
          title: 'Contact',
          fields: [
            contactField('phone-href'),
            contactField('phone-label'),
            contactField('email-href'),
            contactField('email-label'),
          ],
        },
        {
          title: 'Media',
          fields: [imageField('image-url'), imageField('image-alt')],
        },
      ]}
    />
  );
}
