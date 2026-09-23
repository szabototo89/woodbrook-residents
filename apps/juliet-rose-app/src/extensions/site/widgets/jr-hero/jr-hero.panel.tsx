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
              help: 'Small line above the hero heading naming the studio specialties.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Large hero heading visitors read first.',
            },
            {
              key: 'location',
              label: 'Location',
              kind: 'text',
              help: 'Line under the heading saying where treatments happen.',
            },
            {
              key: 'copy',
              label: 'Copy first line',
              kind: 'longText',
              help: 'First line of the hero intro paragraph.',
            },
            {
              key: 'copy-second-line',
              label: 'Copy second line',
              kind: 'text',
              help: 'Second line of the hero intro paragraph, completing the sentence above.',
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
