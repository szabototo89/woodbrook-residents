import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrGiftCardPageExtension: SiteWidgetExtension = {
  id: '3e840f9c-5ac4-41a1-86fd-cd6936547339',
  name: 'JR Gift Card Page',
  tagName: 'jr-gift-card-page',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 1350 },
  installation: { autoAdd: false },
  element: './site/widgets/jr-gift-card-page/jr-gift-card-page.tsx',
  settings: './site/widgets/jr-gift-card-page/jr-gift-card-page.panel.tsx',
  presets: [
    {
      id: '31bc388d-2bae-4c95-a8c0-fee83b534ce4',
      name: 'Gift card page',
      thumbnailUrl: '{{BASE_URL}}/jr-gift-card-page-thumbnail.png',
    },
  ],
};
