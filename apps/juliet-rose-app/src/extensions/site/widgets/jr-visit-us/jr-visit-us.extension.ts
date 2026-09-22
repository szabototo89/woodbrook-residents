import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '55edbf7d-c1a0-4d81-9266-2167c022ebca',
  name: 'JR Visit Us',
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
      id: 'f90c94d5-c617-48e8-9156-c3e34ce7d0d2',
      name: 'Visit us',
      thumbnailUrl: '{{BASE_URL}}/jr-visit-us-thumbnail.png',
    },
  ],
  tagName: 'jr-visit-us',
  element: './extensions/site/widgets/jr-visit-us/jr-visit-us.tsx',
  settings: './extensions/site/widgets/jr-visit-us/jr-visit-us.panel.tsx',
});
