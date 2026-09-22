import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrHomePageExtension: SiteWidgetExtension = {
  id: 'bb44c641-e00d-457d-a44b-618cfd6c285a',
  name: 'JR Complete Home Page',
  tagName: 'jr-home-page',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 2500 },
  installation: { autoAdd: false },
  element: './site/widgets/jr-home-page/jr-home-page.tsx',
  settings: './site/widgets/jr-home-page/jr-home-page.panel.tsx',
  presets: [
    {
      id: '7cbd7b22-72ee-4795-8a9d-981f2634ff5f',
      name: 'Complete home page',
      thumbnailUrl: '{{BASE_URL}}/jr-home-page-thumbnail.png',
    },
  ],
};
