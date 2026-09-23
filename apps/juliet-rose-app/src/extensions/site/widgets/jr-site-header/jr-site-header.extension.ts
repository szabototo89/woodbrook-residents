import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '0eef80e2-109c-45a8-a037-f88931988a06',
  name: 'JR Site Header',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 63,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: '5c2ff917-baef-4ec3-97b4-b8a1d8aec852',
      name: 'Site header',
      thumbnailUrl: '{{BASE_URL}}/jr-site-header-thumbnail.png',
    },
  ],
  tagName: 'jr-site-header',
  element: './extensions/site/widgets/jr-site-header/jr-site-header.tsx',
  settings: './extensions/site/widgets/jr-site-header/jr-site-header.panel.tsx',
});
