import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'f86db3ab-2132-442f-837a-fead45f9dec1',
  name: 'JR Treatment Guidance',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 200,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: '2d837520-b663-45ed-94ff-1add15e36dee',
      name: 'Treatment guidance',
      thumbnailUrl: '{{BASE_URL}}/jr-treatment-guidance-thumbnail.png',
    },
  ],
  tagName: 'jr-treatment-guidance',
  element:
    './extensions/site/widgets/jr-treatment-guidance/jr-treatment-guidance.tsx',
  settings:
    './extensions/site/widgets/jr-treatment-guidance/jr-treatment-guidance.panel.tsx',
});
