import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import {
  bookingLinkField,
  contactField,
  imageField,
} from '../../widget-panel/sharedFields';

export default function StudioSectionsPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-studio-sections-panel"
      title="Studio sections settings"
      subtitle="Gift card, contact and policy links shared by the home sections"
      sections={[
        {
          title: 'Links',
          fields: [
            bookingLinkField('gift-card-url'),
            bookingLinkField('policy-url'),
          ],
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
          fields: [
            imageField('studio-image-url'),
            imageField('studio-image-alt'),
          ],
        },
      ]}
    />
  );
}
