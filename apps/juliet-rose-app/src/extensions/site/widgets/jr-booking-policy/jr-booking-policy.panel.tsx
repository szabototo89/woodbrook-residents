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
              help: 'Small line above the policy heading, e.g. Before your appointment.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Heading of the policy section.',
            },
            {
              key: 'copy',
              label: 'Policy summary',
              kind: 'longText',
              help: 'Two or three sentences of must-know policy: arrival, cancellation notice, and late arrivals.',
            },
            {
              key: 'full-label',
              label: 'Full policy link label',
              kind: 'text',
              help: 'Text of the link that opens the complete policy, e.g. Read the full policy.',
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
