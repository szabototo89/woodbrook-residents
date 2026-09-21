import type { SiteWidgetExtension } from '../../siteWidgetExtension';

export const jrBookingJourneyExtension: SiteWidgetExtension = {
  id: '8ab49368-3f0b-4f12-9b0d-51a3408ebf9b',
  name: 'JR Booking Journey',
  tagName: 'jr-booking-journey',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
    stretchByDefault: true,
  },
  height: {
    defaultHeight: 1200,
  },
  installation: {
    autoAdd: false,
  },
  element: './site/widgets/jr-booking-journey/jr-booking-journey.tsx',
  settings: './site/widgets/jr-booking-journey/jr-booking-journey.panel.tsx',
  presets: [
    {
      id: '075b0222-dfff-41ce-a3cf-2abc489cbf83',
      name: 'Booking journey',
      thumbnailUrl: '{{BASE_URL}}/jr-booking-journey-thumbnail.png',
    },
  ],
};
