import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'f5f59af9-e408-4a9c-b9e0-74b365f2b448',
  name: 'JR Gift Card',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 220,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: 'af62bb93-9b53-491c-bcba-c371dafa36b9',
      name: 'Gift card',
      thumbnailUrl: '{{BASE_URL}}/jr-gift-card-thumbnail.png',
    },
  ],
  tagName: 'jr-gift-card',
  element: './extensions/site/widgets/jr-gift-card/jr-gift-card.tsx',
  settings: './extensions/site/widgets/jr-gift-card/jr-gift-card.panel.tsx',
});
