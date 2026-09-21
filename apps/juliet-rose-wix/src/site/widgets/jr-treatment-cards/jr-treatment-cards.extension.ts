import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrTreatmentCardsExtension: SiteWidgetExtension = {
  id: 'a5985c2f-0943-4133-94d4-ad3c412d380b',
  name: 'JR Treatment Cards',
  tagName: 'jr-treatment-cards',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 900,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-treatment-cards/jr-treatment-cards.tsx',
  settings: './site/widgets/jr-treatment-cards/jr-treatment-cards.panel.tsx',
  presets: [
    {
      id: 'ce8d2ac5-60b4-4db3-8159-3dfb24415c7f',
      name: 'Treatment cards',
      thumbnailUrl: '{{BASE_URL}}/jr-treatment-cards-thumbnail.png',
    },
  ],
};
