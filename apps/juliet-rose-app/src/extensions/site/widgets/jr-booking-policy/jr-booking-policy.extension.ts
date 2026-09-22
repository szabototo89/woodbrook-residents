import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'f7f0a4f3-3cfa-4064-83bd-800e5b00716e',
  name: 'JR Booking Policy',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 200,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: '2aebff2d-397c-40df-87e3-739e6aab1fef',
      name: 'Booking policy',
      thumbnailUrl: '{{BASE_URL}}/jr-booking-policy-thumbnail.png',
    },
  ],
  tagName: 'jr-booking-policy',
  element: './extensions/site/widgets/jr-booking-policy/jr-booking-policy.tsx',
  settings:
    './extensions/site/widgets/jr-booking-policy/jr-booking-policy.panel.tsx',
});
