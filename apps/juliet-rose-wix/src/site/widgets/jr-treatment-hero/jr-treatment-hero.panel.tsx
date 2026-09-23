import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { imageField } from '../../widget-panel/sharedFields';

export default function TreatmentHeroPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-treatment-hero-panel"
      title="Treatment hero settings"
      subtitle="Treatments page hero copy and background"
      sections={[
        {
          title: 'Content',
          fields: [
            {
              key: 'eyebrow',
              label: 'Eyebrow',
              kind: 'text',
              help: 'Small line above the treatments hero heading.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Large heading of the treatments page hero.',
            },
            {
              key: 'description',
              label: 'Description',
              kind: 'longText',
              help: 'Paragraph under the hero title explaining how to choose a treatment and request an appointment.',
            },
            {
              key: 'script-first-line',
              label: 'Script first line',
              kind: 'text',
              help: 'First line of the decorative handwritten overlay on the hero photo, e.g. Relax.',
            },
            {
              key: 'script-second-line',
              label: 'Script second line',
              kind: 'text',
              help: 'Second line of the decorative handwritten overlay, e.g. and.',
            },
            {
              key: 'script-third-line',
              label: 'Script third line',
              kind: 'text',
              help: 'Third line of the decorative handwritten overlay, e.g. Rejuvenate.',
            },
          ],
        },
        {
          title: 'Media',
          fields: [imageField('image-url')],
        },
      ]}
    />
  );
}
