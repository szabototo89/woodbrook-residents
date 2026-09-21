import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrVisitUsExtension: SiteWidgetExtension = {
  id: 'e1aaf174-b856-40c9-aa33-fe40623ca90d',
  name: 'JR Visit Us',
  tagName: 'jr-visit-us',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 420,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-visit-us/jr-visit-us.tsx',
  settings: './site/widgets/jr-visit-us/jr-visit-us.panel.tsx',
  presets: [
    {
      id: '7f37e297-b6a2-4f3e-b1d3-174eb3d787d',
      name: 'Visit us',
      thumbnailUrl: '{{BASE_URL}}/jr-visit-us-thumbnail.png',
    },
  ],
};
