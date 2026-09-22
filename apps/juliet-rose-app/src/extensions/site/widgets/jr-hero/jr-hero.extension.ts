import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'a45fbaff-adf2-455a-ac93-64e8cc9edf54',
  name: 'JR Hero',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 560,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: 'c2bdae90-c0e0-4e42-98dc-e3ca5bb3799a',
      name: 'Studio hero',
      thumbnailUrl: '{{BASE_URL}}/jr-hero-thumbnail.png',
    },
  ],
  tagName: 'jr-hero',
  element: './extensions/site/widgets/jr-hero/jr-hero.tsx',
  settings: './extensions/site/widgets/jr-hero/jr-hero.panel.tsx',
});
