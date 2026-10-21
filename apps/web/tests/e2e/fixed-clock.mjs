import { mock } from 'node:test';

// Keep the published event fixtures upcoming when server loaders filter them.
mock.timers.enable({
  apis: ['Date'],
  now: new Date('2026-10-01T12:00:00.000Z'),
});
