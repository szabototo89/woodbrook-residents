import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrTreatmentHeroExtension: SiteWidgetExtension = {
  id: 'e0ccdcb5-a4b5-4912-a400-c1024868369e',
  name: 'JR Treatment Hero',
  tagName: 'jr-treatment-hero',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 430 },
  installation: { autoAdd: false },
  element: './site/widgets/jr-treatment-hero/jr-treatment-hero.tsx',
  settings: './site/widgets/jr-treatment-hero/jr-treatment-hero.panel.tsx',
  presets: [
    {
      id: '3f22f35f-9efa-4c7a-9f5e-1a50b101ccb2',
      name: 'Treatments hero',
      thumbnailUrl: '{{BASE_URL}}/jr-treatment-hero-thumbnail.png',
    },
  ],
};
