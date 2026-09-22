import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'bea0fee1-8d6f-4263-ad71-8d2346de0494',
  name: 'JR Category Grid',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 420,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: '5f2e3f85-ff0f-48a6-b3b6-58d7de8d8c2e',
      name: 'Category grid',
      thumbnailUrl: '{{BASE_URL}}/jr-category-grid-thumbnail.png',
    },
  ],
  tagName: 'jr-category-grid',
  element: './extensions/site/widgets/jr-category-grid/jr-category-grid.tsx',
  settings:
    './extensions/site/widgets/jr-category-grid/jr-category-grid.panel.tsx',
});
