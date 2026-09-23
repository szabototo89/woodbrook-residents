import { SettingsPanel } from '../../widget-panel/SettingsPanel';
import { viewAllFields } from '../../widget-panel/sharedFields';

export default function JrCategoryGridPanel() {
  return (
    <SettingsPanel
      dataHookPrefix="jr-category-grid-panel"
      title="Category grid settings"
      subtitle="View-all action for the treatment categories"
      sections={[
        {
          title: 'Links',
          fields: [...viewAllFields()],
        },
      ]}
    />
  );
}
