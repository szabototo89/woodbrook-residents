import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '3ecdd6fc-155b-4379-b4ce-13548b0756e7',
  name: 'JR Complete Treatments',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 1600 },
  installation: { autoAdd: false },
  presets: [
    {
      id: '5b8f1dec-8068-4ce6-b1f8-77fcf34f5e78',
      name: 'Complete treatments page',
      thumbnailUrl: '{{BASE_URL}}/jr-treatments-page-thumbnail.png',
    },
  ],
  tagName: 'jr-treatments-page',
  element:
    './extensions/site/widgets/jr-treatments-page/jr-treatments-page.tsx',
  settings:
    './extensions/site/widgets/jr-treatments-page/jr-treatments-page.panel.tsx',
});
