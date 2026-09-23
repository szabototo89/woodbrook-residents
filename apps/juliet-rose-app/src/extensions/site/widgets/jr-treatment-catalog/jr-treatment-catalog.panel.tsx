import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { bookingLinkField } from '../../widget-panel/sharedFields';

export default function JrTreatmentCatalogPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-treatment-catalog-panel"
      title="Treatment catalog settings"
      subtitle="Where booking buttons send visitors"
      sections={[
        {
          title: 'Links',
          fields: [bookingLinkField('booking-base-url')],
        },
      ]}
    />
  );
}
