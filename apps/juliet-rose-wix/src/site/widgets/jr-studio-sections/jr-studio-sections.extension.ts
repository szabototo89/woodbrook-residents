import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrStudioSectionsExtension: SiteWidgetExtension = {
  id: '1bd97878-a67c-48d9-bc84-4fbf49686c16',
  name: 'JR Studio Sections',
  tagName: 'jr-studio-sections',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 840 },
  installation: { autoAdd: false },
  element: './site/widgets/jr-studio-sections/jr-studio-sections.tsx',
  settings: './site/widgets/jr-studio-sections/jr-studio-sections.panel.tsx',
  presets: [
    {
      id: '820bac35-13c9-4368-8a6a-73e0932f81a5',
      name: 'Studio sections',
      thumbnailUrl: '{{BASE_URL}}/jr-studio-sections-thumbnail.png',
    },
  ],
};
