import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrGiftCardExtension: SiteWidgetExtension = {
  id: '3e3a18ef-cf2b-478d-ada5-c85274a8bcf8',
  name: 'JR Gift Card',
  tagName: 'jr-gift-card',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 220,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-gift-card/jr-gift-card.tsx',
  settings: './site/widgets/jr-gift-card/jr-gift-card.panel.tsx',
  presets: [
    {
      id: 'a7fc1cba-d45e-4e7d-866f-00c38b055777',
      name: 'Gift card',
      thumbnailUrl: '{{BASE_URL}}/jr-gift-card-thumbnail.png',
    },
  ],
};
