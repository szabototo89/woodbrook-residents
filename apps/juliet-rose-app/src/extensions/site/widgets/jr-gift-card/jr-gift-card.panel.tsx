import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField } from '../../widget-panel/sharedFields';

export default function JrGiftCardPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-gift-card-panel"
      title="Gift card teaser settings"
      subtitle="Homepage gift-card section copy and link"
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
              help: 'Section heading.',
            },
            {
              key: 'copy-lead',
              label: 'Lead copy',
              kind: 'longText',
              help: 'Opening gift-card sentence.',
            },
            {
              key: 'copy-rest',
              label: 'Supporting copy',
              kind: 'longText',
              help: 'Follow-up sentence, e.g. amounts available.',
            },
            {
              key: 'button-label',
              label: 'Button label',
              kind: 'text',
              help: 'Label of the gift-card button.',
            },
          ],
        },
        {
          title: 'Links',
          fields: [bookingLinkField('card-url')],
        },
      ]}
    />
  );
}
