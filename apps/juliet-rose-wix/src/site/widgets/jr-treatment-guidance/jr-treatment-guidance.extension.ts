import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrTreatmentGuidanceExtension: SiteWidgetExtension = {
  id: '753402f3-8657-4d1b-94e1-34e45bdbdf0d',
  name: 'JR Treatment Guidance',
  tagName: 'jr-treatment-guidance',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 200,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-treatment-guidance/jr-treatment-guidance.tsx',
  settings:
    './site/widgets/jr-treatment-guidance/jr-treatment-guidance.panel.tsx',
  presets: [
    {
      id: 'e10dabcc-4742-41c6-a794-24b99c4c027c',
      name: 'Treatment guidance',
      thumbnailUrl: '{{BASE_URL}}/jr-treatment-guidance-thumbnail.png',
    },
  ],
};
