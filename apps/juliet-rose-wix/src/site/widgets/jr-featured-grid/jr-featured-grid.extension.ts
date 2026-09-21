import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrFeaturedGridExtension: SiteWidgetExtension = {
  id: 'e1ef51f8-aa3a-4bcc-b173-e674148e2809',
  name: 'JR Featured Grid',
  tagName: 'jr-featured-grid',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 520,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-featured-grid/jr-featured-grid.tsx',
  settings: './site/widgets/jr-featured-grid/jr-featured-grid.panel.tsx',
  presets: [
    {
      id: '8f5d4880-50fe-40ca-81b4-495b83b90',
      name: 'Featured grid',
      thumbnailUrl: '{{BASE_URL}}/jr-featured-grid-thumbnail.png',
    },
  ],
};
