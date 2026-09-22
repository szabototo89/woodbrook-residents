import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrSiteFooterExtension: SiteWidgetExtension = {
  id: '33c4b14d-cf0b-45fe-9e4f-9df419196b1f',
  name: 'JR Site Footer',
  tagName: 'jr-site-footer',
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
  element: './site/widgets/jr-site-footer/jr-site-footer.tsx',
  settings: './site/widgets/jr-site-footer/jr-site-footer.panel.tsx',
  presets: [
    {
      id: '33354bac-2c27-49f0-b0d1-be3766496da2',
      name: 'Site footer',
      thumbnailUrl: '{{BASE_URL}}/jr-site-footer-thumbnail.png',
    },
  ],
};
