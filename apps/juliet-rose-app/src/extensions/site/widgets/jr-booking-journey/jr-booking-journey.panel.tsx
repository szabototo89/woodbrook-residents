import { SettingsPanel } from '../../widget-panel/SettingsPanel';

export default function BookingJourneyPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-booking-journey-panel"
      title="Booking journey settings"
      subtitle="Preselect the treatment visitors start with"
      sections={[
        {
          title: 'Scheduling',
          fields: [
            {
              key: 'initial-service',
              label: 'Preselected service',
              kind: 'text',
              help: 'Treatment slug preselected when the widget loads, e.g. swedish-massage. Leave empty for no preselection.',
              placeholder: 'swedish-massage',
            },
          ],
        },
      ]}
    />
  );
}
