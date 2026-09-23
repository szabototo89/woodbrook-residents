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
              help: 'Short kicker above the title.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Main hero heading.',
            },
            {
              key: 'description',
              label: 'Description',
              kind: 'longText',
              help: 'Intro copy under the hero title.',
            },
            {
              key: 'script-first-line',
              label: 'Script first line',
              kind: 'text',
              help: 'Decorative script line, e.g. Relax.',
            },
            {
              key: 'script-second-line',
              label: 'Script second line',
              kind: 'text',
              help: 'Decorative script line, e.g. and.',
            },
            {
              key: 'script-third-line',
              label: 'Script third line',
              kind: 'text',
              help: 'Decorative script line, e.g. Rejuvenate.',
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
