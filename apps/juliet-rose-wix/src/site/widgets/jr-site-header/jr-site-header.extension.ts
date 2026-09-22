import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrSiteHeaderExtension: SiteWidgetExtension = {
  id: '69ea4708-52d0-4be7-a64c-65bdf2455fb2',
  name: 'JR Site Header',
  tagName: 'jr-site-header',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 63,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-site-header/jr-site-header.tsx',
  settings: './site/widgets/jr-site-header/jr-site-header.panel.tsx',
  presets: [
    {
      id: 'd6e0e7d8-03c2-481d-b43d-5689a23e58d6',
      name: 'Site header',
      thumbnailUrl: '{{BASE_URL}}/jr-site-header-thumbnail.png',
    },
  ],
};
