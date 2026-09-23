import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField } from '../../widget-panel/sharedFields';

export default function JrTreatmentGuidancePanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-treatment-guidance-panel"
      title="Treatment guidance settings"
      subtitle="Where the contact button sends visitors"
      sections={[
        {
          title: 'Links',
          fields: [bookingLinkField('contact-url')],
        },
      ]}
    />
  );
}
