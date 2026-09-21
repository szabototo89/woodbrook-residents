import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrTreatmentCatalogExtension: SiteWidgetExtension = {
  id: '000a7acf-7010-4065-9ff7-1d8dd7ce337c',
  name: 'JR Treatment Catalog',
  tagName: 'jr-treatment-catalog',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 700,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-treatment-catalog/jr-treatment-catalog.tsx',
  settings:
    './site/widgets/jr-treatment-catalog/jr-treatment-catalog.panel.tsx',
  presets: [
    {
      id: 'e76b99e9-9436-476d-97e0-a8f8175fe61a',
      name: 'Treatment catalog',
      thumbnailUrl: '{{BASE_URL}}/jr-treatment-catalog-thumbnail.png',
    },
  ],
};
