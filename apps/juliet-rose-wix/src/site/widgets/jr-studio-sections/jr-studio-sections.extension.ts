import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrStudioSectionsExtension: SiteWidgetExtension = {
  id: '83c0a413-fc2e-41c5-8732-56f36e0ce782',
  name: 'JR Studio Sections',
  tagName: 'jr-studio-sections',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 800,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-studio-sections/jr-studio-sections.tsx',
  settings: './site/widgets/jr-studio-sections/jr-studio-sections.panel.tsx',
  presets: [
    {
      id: '1c2f454e-5ffe-426c-9c12-b53f2a6adb34',
      name: 'Studio sections',
      thumbnailUrl: '{{BASE_URL}}/jr-studio-sections-thumbnail.png',
    },
  ],
};
