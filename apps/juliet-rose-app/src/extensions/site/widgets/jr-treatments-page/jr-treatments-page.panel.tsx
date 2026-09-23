import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField, imageField } from '../../widget-panel/sharedFields';

export default function TreatmentsPagePanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-treatments-page-panel"
      title="Treatments page settings"
      subtitle="Hero copy and links for the full page"
      sections={[
        {
          title: 'Hero content',
          fields: [
            {
              key: 'hero-eyebrow',
              label: 'Hero eyebrow',
              kind: 'text',
              help: 'Short kicker above the hero title.',
            },
            {
              key: 'hero-title',
              label: 'Hero title',
              kind: 'text',
              help: 'Main hero heading.',
            },
            {
              key: 'hero-description',
              label: 'Hero description',
              kind: 'longText',
              help: 'Intro copy under the hero title.',
            },
          ],
        },
        {
          title: 'Links',
          fields: [
            bookingLinkField('booking-base-url'),
            bookingLinkField('contact-url'),
          ],
        },
        {
          title: 'Media',
          fields: [imageField('hero-image-url')],
        },
      ]}
    />
  );
}
