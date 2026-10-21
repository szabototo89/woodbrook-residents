import { mock } from 'node:test';

// Keep the server's upcoming-event filter aligned with the editorial fixtures.
mock.timers.enable({
  apis: ['Date'],
  now: new Date('2026-09-10T12:00:00.000Z'),
});
