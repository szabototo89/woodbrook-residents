import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import {
  bookingLinkField,
  viewAllFields,
} from '../../widget-panel/sharedFields';

export default function JrFeaturedGridPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-featured-grid-panel"
      title="Featured treatments settings"
      subtitle="Which treatments to feature and where buttons link"
      sections={[
        {
          title: 'Content',
          fields: [
            {
              key: 'featured-slugs',
              label: 'Featured slugs',
              kind: 'text',
              help: 'Comma-separated slugs of the treatments shown in this grid, e.g. swedish-massage, microneedling. Leave empty for automatic selection.',
              placeholder: 'swedish-massage, microneedling',
            },
          ],
        },
        {
          title: 'Links',
          fields: [bookingLinkField('booking-base-url'), ...viewAllFields()],
        },
      ]}
    />
  );
}
