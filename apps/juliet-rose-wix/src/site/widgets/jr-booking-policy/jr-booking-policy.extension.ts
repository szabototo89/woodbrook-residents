import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrBookingPolicyExtension: SiteWidgetExtension = {
  id: '84a14435-9c6c-497e-aebf-32e0deb7c6d9',
  name: 'JR Booking Policy',
  tagName: 'jr-booking-policy',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 200,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-booking-policy/jr-booking-policy.tsx',
  settings: './site/widgets/jr-booking-policy/jr-booking-policy.panel.tsx',
  presets: [
    {
      id: '7e87b6b0-1883-4e53-895a-b315eb0f2ae5',
      name: 'Booking policy',
      thumbnailUrl: '{{BASE_URL}}/jr-booking-policy-thumbnail.png',
    },
  ],
};
