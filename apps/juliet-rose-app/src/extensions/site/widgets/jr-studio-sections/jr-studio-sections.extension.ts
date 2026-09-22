import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '1bd97878-a67c-48d9-bc84-4fbf49686c16',
  name: 'JR Studio Sections',
  width: { defaultWidth: 1200, allowStretch: true, stretchByDefault: true },
  height: { defaultHeight: 840 },
  installation: { autoAdd: false },
  presets: [
    {
      id: '820bac35-13c9-4368-8a6a-73e0932f81a5',
      name: 'Studio sections',
      thumbnailUrl: '{{BASE_URL}}/jr-studio-sections-thumbnail.png',
    },
  ],
  tagName: 'jr-studio-sections',
  element:
    './extensions/site/widgets/jr-studio-sections/jr-studio-sections.tsx',
  settings:
    './extensions/site/widgets/jr-studio-sections/jr-studio-sections.panel.tsx',
});
