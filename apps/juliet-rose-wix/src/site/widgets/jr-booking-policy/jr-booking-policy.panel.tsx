import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField } from '../../widget-panel/sharedFields';

export default function JrBookingPolicyPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-booking-policy-panel"
      title="Booking policy settings"
      subtitle="Summary copy and the full policy link"
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
              key: 'copy',
              label: 'Policy summary',
              kind: 'longText',
              help: 'Short summary, e.g. arrival and cancellation notice.',
            },
            {
              key: 'full-label',
              label: 'Full policy link label',
              kind: 'text',
              help: 'Label of the link to the full policy.',
            },
          ],
        },
        {
          title: 'Links',
          fields: [bookingLinkField('full-url')],
        },
      ]}
    />
  );
}
