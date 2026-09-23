import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField } from '../../widget-panel/sharedFields';

export default function SiteHeaderPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-site-header-panel"
      title="Site header settings"
      subtitle="Brand, navigation and booking action"
      sections={[
        {
          title: 'Brand',
          fields: [
            {
              key: 'active-navigation-item',
              label: 'Active page',
              kind: 'choice',
              help: 'Highlights the matching navigation item. Leave empty to detect automatically from the page URL.',
              options: [
                { id: '', value: 'Automatic' },
                { id: '/', value: 'Home' },
                { id: '/treatments', value: 'Treatments' },
              ],
            },
            {
              key: 'brand-title',
              label: 'Brand title',
              kind: 'text',
              help: 'Studio name, e.g. Juliet Rose.',
            },
            {
              key: 'brand-subtitle',
              label: 'Brand subtitle',
              kind: 'text',
              help: 'Studio descriptor, e.g. Beauty Studio.',
            },
          ],
        },
        {
          title: 'Links',
          fields: [
            bookingLinkField('home-url'),
            bookingLinkField('treatments-url'),
            bookingLinkField('gift-cards-url'),
            bookingLinkField('contact-url'),
            bookingLinkField('booking-url'),
            {
              key: 'booking-label',
              label: 'Booking label',
              kind: 'text',
              help: 'Label of the header booking button.',
            },
          ],
        },
      ]}
    />
  );
}
