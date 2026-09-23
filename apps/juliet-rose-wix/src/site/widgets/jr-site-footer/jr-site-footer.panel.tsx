import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField } from '../../widget-panel/sharedFields';

export default function SiteFooterPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-site-footer-panel"
      title="Site footer settings"
      subtitle="Brand, navigation and closing copy"
      sections={[
        {
          title: 'Brand',
          fields: [
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
            {
              key: 'tagline',
              label: 'Tagline',
              kind: 'text',
              help: 'Short closing line shown in the footer.',
            },
            {
              key: 'copyright',
              label: 'Copyright line',
              kind: 'text',
              help: 'Copyright notice with year.',
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
            bookingLinkField('instagram-url'),
          ],
        },
      ]}
    />
  );
}
