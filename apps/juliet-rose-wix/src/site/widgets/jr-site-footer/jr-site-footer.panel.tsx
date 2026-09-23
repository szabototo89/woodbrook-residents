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
              help: 'Studio name shown in the footer brand block, e.g. Juliet Rose.',
            },
            {
              key: 'brand-subtitle',
              label: 'Brand subtitle',
              kind: 'text',
              help: 'Small descriptor under the footer studio name, e.g. Beauty Studio.',
            },
            {
              key: 'tagline',
              label: 'Tagline',
              kind: 'text',
              help: 'Short closing line under the footer brand, e.g. Relax and Revitalize.',
            },
            {
              key: 'copyright',
              label: 'Copyright line',
              kind: 'text',
              help: 'Bottom line of the footer with the year and studio name. Update the year when it changes.',
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
