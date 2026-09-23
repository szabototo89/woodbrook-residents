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
              help: 'Short kicker above the title.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Section heading.',
            },
            {
              key: 'address',
              label: 'Address',
              kind: 'longText',
              help: 'Full studio address shown to visitors.',
            },
            {
              key: 'hours-days',
              label: 'Opening days',
              kind: 'text',
              help: 'e.g. Monday – Friday.',
            },
            {
              key: 'hours-time',
              label: 'Opening hours',
              kind: 'text',
              help: 'e.g. 10.00am – 8.00pm.',
            },
            {
              key: 'contact-button-label',
              label: 'Contact button label',
              kind: 'text',
              help: 'Label of the contact button.',
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
