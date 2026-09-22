import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'c4d0167e-8402-49aa-8309-3bb65c45b734',
  name: 'JR Featured Grid',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 520,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: '316ccd6c-28bb-41b6-8944-c44f7b292e79',
      name: 'Featured grid',
      thumbnailUrl: '{{BASE_URL}}/jr-featured-grid-thumbnail.png',
    },
  ],
  tagName: 'jr-featured-grid',
  element: './extensions/site/widgets/jr-featured-grid/jr-featured-grid.tsx',
  settings:
    './extensions/site/widgets/jr-featured-grid/jr-featured-grid.panel.tsx',
});
