import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrTreatmentsPageExtension: SiteWidgetExtension = {
  id: '3ecdd6fc-155b-4379-b4ce-13548b0756e7',
  name: 'JR Complete Treatments',
  tagName: 'jr-treatments-page',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 1600 },
  installation: { autoAdd: false },
  element: './site/widgets/jr-treatments-page/jr-treatments-page.tsx',
  settings: './site/widgets/jr-treatments-page/jr-treatments-page.panel.tsx',
  presets: [
    {
      id: '5b8f1dec-8068-4ce6-b1f8-77fcf34f5e78',
      name: 'Complete treatments page',
      thumbnailUrl: '{{BASE_URL}}/jr-treatments-page-thumbnail.png',
    },
  ],
};
