import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '3c24bd2a-bf23-460c-85da-06d0d58e6f21',
  name: 'JR Booking Journey',
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 1200,
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: 'b7433ba7-16b2-4e36-85af-2f018b8c6cd3',
      name: 'Booking journey',
      thumbnailUrl: '{{BASE_URL}}/jr-booking-journey-thumbnail.png',
    },
  ],
  tagName: 'jr-booking-journey',
  element:
    './extensions/site/widgets/jr-booking-journey/jr-booking-journey.tsx',
  settings:
    './extensions/site/widgets/jr-booking-journey/jr-booking-journey.panel.tsx',
});
