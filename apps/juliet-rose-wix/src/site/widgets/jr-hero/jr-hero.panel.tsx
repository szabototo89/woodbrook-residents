import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField, imageField } from '../../widget-panel/sharedFields';

export default function HeroPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-hero-panel"
      title="Hero settings"
      subtitle="Homepage hero content, links and imagery"
      sections={[
        {
          title: 'Content',
          fields: [
            {
              key: 'eyebrow',
              label: 'Eyebrow',
              kind: 'text',
              help: 'Short kicker above the title.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Main hero heading.',
            },
            {
              key: 'location',
              label: 'Location',
              kind: 'text',
              help: 'Subheading naming the studio area.',
            },
            {
              key: 'copy',
              label: 'Copy first line',
              kind: 'longText',
              help: 'Intro copy, first line.',
            },
            {
              key: 'copy-second-line',
              label: 'Copy second line',
              kind: 'text',
              help: 'Intro copy, second line.',
            },
          ],
        },
        {
          title: 'Links',
          fields: [
            bookingLinkField('booking-url'),
            bookingLinkField('treatments-url'),
            bookingLinkField('policy-url'),
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
