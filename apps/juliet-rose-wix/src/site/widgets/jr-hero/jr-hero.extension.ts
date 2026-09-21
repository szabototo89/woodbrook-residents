import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrHeroExtension: SiteWidgetExtension = {
  id: '0bf2eca5-fba6-49e7-a626-fee77d7c83e2',
  name: 'JR Hero',
  tagName: 'jr-hero',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 560,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-hero/jr-hero.tsx',
  settings: './site/widgets/jr-hero/jr-hero.panel.tsx',
  presets: [
    {
      id: 'd21d5cd0-b7b7-4970-92fa-b0e41bd50b31',
      name: 'Studio hero',
      thumbnailUrl: '{{BASE_URL}}/jr-hero-thumbnail.png',
    },
  ],
};
