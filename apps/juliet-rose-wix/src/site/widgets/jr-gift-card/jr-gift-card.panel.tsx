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
              help: 'Small line above the gift-card heading.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Heading of the gift-card teaser.',
            },
            {
              key: 'copy-lead',
              label: 'Lead copy',
              kind: 'longText',
              help: 'First gift-card sentence, saying who it is for.',
            },
            {
              key: 'copy-rest',
              label: 'Supporting copy',
              kind: 'longText',
              help: 'Second gift-card sentence, e.g. which treatments or amounts it covers.',
            },
            {
              key: 'button-label',
              label: 'Button label',
              kind: 'text',
              help: 'Text on the button that takes visitors to the gift-card page.',
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
