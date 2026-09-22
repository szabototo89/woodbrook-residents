import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '3e840f9c-5ac4-41a1-86fd-cd6936547339',
  name: 'JR Gift Card Page',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 1350 },
  installation: { autoAdd: false },
  presets: [
    {
      id: '31bc388d-2bae-4c95-a8c0-fee83b534ce4',
      name: 'Gift card page',
      thumbnailUrl: '{{BASE_URL}}/jr-gift-card-page-thumbnail.png',
    },
  ],
  tagName: 'jr-gift-card-page',
  element: './extensions/site/widgets/jr-gift-card-page/jr-gift-card-page.tsx',
  settings:
    './extensions/site/widgets/jr-gift-card-page/jr-gift-card-page.panel.tsx',
});
