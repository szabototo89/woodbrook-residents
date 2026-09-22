import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'a5f3a252-e391-4979-a7eb-6f07ba130efc',
  name: 'JR Treatment Catalog',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 700,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: '102a894a-5971-45d9-937e-299024959631',
      name: 'Treatment catalog',
      thumbnailUrl: '{{BASE_URL}}/jr-treatment-catalog-thumbnail.png',
    },
  ],
  tagName: 'jr-treatment-catalog',
  element:
    './extensions/site/widgets/jr-treatment-catalog/jr-treatment-catalog.tsx',
  settings:
    './extensions/site/widgets/jr-treatment-catalog/jr-treatment-catalog.panel.tsx',
});
