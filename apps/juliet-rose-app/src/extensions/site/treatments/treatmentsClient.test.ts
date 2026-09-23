import { expect, test, vi } from 'vitest';

import wixConfig from '../../../../wix.config.json';

const mocks = vi.hoisted(() => ({
  host: vi.fn(() => 'site-host'),
  auth: vi.fn(() => 'site-auth'),
  createClient: vi.fn(() => ({
    auth: { getAccessTokenInjector: () => 'injector' },
  })),
}));

vi.mock('@wix/site', () => ({ site: { host: mocks.host, auth: mocks.auth } }));
vi.mock('@wix/sdk', () => ({ createClient: mocks.createClient }));

import { getTreatmentsAccessTokenInjector } from './treatmentsServices';

test('treatment widgets identify the app when creating the Wix site host', () => {
  expect(getTreatmentsAccessTokenInjector()).toBe('injector');
  expect(mocks.host).toHaveBeenCalledWith({ applicationId: wixConfig.appId });
});
