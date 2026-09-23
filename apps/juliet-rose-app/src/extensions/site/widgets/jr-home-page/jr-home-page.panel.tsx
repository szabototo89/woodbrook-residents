import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import {
  bookingLinkField,
  contactField,
  imageField,
} from '../../widget-panel/sharedFields';

export default function HomePagePanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-home-page-panel"
      title="Home page settings"
      subtitle="Links, featured treatments and imagery for the full page"
      sections={[
        {
          title: 'Links',
          fields: [
            bookingLinkField('booking-base-url'),
            bookingLinkField('treatments-url'),
            bookingLinkField('gift-card-url'),
          ],
        },
        {
          title: 'Featured treatments',
          fields: [
            {
              key: 'featured-slugs',
              label: 'Featured slugs',
              kind: 'text',
              help: 'Comma-separated slugs of the treatments featured on the home page, e.g. swedish-massage, microneedling. Leave empty for automatic selection.',
              placeholder: 'swedish-massage, microneedling',
            },
          ],
        },
        {
          title: 'Contact',
          fields: [contactField('phone-href'), contactField('email-href')],
        },
        {
          title: 'Media',
          fields: [
            imageField('hero-image-url'),
            imageField('studio-image-url'),
          ],
        },
      ]}
    />
  );
}
