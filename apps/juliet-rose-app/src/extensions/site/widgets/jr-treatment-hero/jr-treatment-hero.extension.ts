import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'e0ccdcb5-a4b5-4912-a400-c1024868369e',
  name: 'JR Treatment Hero',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 430 },
  installation: { autoAdd: false },
  presets: [
    {
      id: '3f22f35f-9efa-4c7a-9f5e-1a50b101ccb2',
      name: 'Treatments hero',
      thumbnailUrl: '{{BASE_URL}}/jr-treatment-hero-thumbnail.png',
    },
  ],
  tagName: 'jr-treatment-hero',
  element: './extensions/site/widgets/jr-treatment-hero/jr-treatment-hero.tsx',
  settings:
    './extensions/site/widgets/jr-treatment-hero/jr-treatment-hero.panel.tsx',
});
