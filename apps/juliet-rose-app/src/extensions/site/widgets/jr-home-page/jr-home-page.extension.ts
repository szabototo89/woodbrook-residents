import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'bb44c641-e00d-457d-a44b-618cfd6c285a',
  name: 'JR Complete Home Page',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 2500 },
  installation: { autoAdd: false },
  presets: [
    {
      id: '7cbd7b22-72ee-4795-8a9d-981f2634ff5f',
      name: 'Complete home page',
      thumbnailUrl: '{{BASE_URL}}/jr-home-page-thumbnail.png',
    },
  ],
  tagName: 'jr-home-page',
  element: './extensions/site/widgets/jr-home-page/jr-home-page.tsx',
  settings: './extensions/site/widgets/jr-home-page/jr-home-page.panel.tsx',
});
