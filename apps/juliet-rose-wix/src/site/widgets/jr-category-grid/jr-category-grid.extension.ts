import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrCategoryGridExtension: SiteWidgetExtension = {
  id: '4286fe53-49ab-4f57-a139-05f2d269cda4',
  name: 'JR Category Grid',
  tagName: 'jr-category-grid',
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
  element: './site/widgets/jr-category-grid/jr-category-grid.tsx',
  settings: './site/widgets/jr-category-grid/jr-category-grid.panel.tsx',
  presets: [
    {
      id: '8e443a5c-1ded-407f-bf8b-641a55fc08e7',
      name: 'Category grid',
      thumbnailUrl: '{{BASE_URL}}/jr-category-grid-thumbnail.png',
    },
  ],
};
