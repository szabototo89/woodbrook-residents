import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { contactField, imageField } from '../../widget-panel/sharedFields';

export default function JrVisitUsPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-visit-us-panel"
      title="Visit us settings"
      subtitle="Studio address, hours, contact and photo"
      sections={[
        {
          title: 'Content',
          fields: [
            {
              key: 'eyebrow',
              label: 'Eyebrow',
              kind: 'text',
              help: 'Small line above the visit-us heading.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Heading of the visit-us section, naming the studio.',
            },
            {
              key: 'address',
              label: 'Address',
              kind: 'longText',
              help: 'Street address visitors use to find the studio, shown beside the opening hours.',
            },
            {
              key: 'hours-days',
              label: 'Opening days',
              kind: 'text',
              help: 'Days the studio is open, e.g. Monday – Friday.',
            },
            {
              key: 'hours-time',
              label: 'Opening hours',
              kind: 'text',
              help: 'Daily opening hours shown under the opening days, e.g. 10.00am – 8.00pm.',
            },
            {
              key: 'contact-button-label',
              label: 'Contact button label',
              kind: 'text',
              help: 'Text on the button that puts visitors in touch with the studio, e.g. Contact Diana.',
            },
          ],
        },
        {
          title: 'Contact',
          fields: [
            contactField('phone-href'),
            contactField('phone-label'),
            contactField('email-href'),
            contactField('email-label'),
          ],
        },
        {
          title: 'Media',
          fields: [
            imageField('studio-image-url'),
            imageField('studio-image-alt'),
          ],
        },
      ]}
    />
  );
}
