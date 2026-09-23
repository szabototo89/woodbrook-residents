import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '82ee9c9f-77b6-4ee9-b267-42034d3aebe6',
  name: 'JR Site Footer',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 156,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: 'afa91397-d3ec-4c86-a00a-87ce1337eb12',
      name: 'Site footer',
      thumbnailUrl: '{{BASE_URL}}/jr-site-footer-thumbnail.png',
    },
  ],
  tagName: 'jr-site-footer',
  element: './extensions/site/widgets/jr-site-footer/jr-site-footer.tsx',
  settings: './extensions/site/widgets/jr-site-footer/jr-site-footer.panel.tsx',
});
