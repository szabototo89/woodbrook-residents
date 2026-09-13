import { expect, test } from 'vitest';

import { getAppPath, getSectionFromPath } from './appFocus';

test('section helpers map between paths and sections', () => {
  expect(getSectionFromPath('/app/web')).toBe('overview');
  expect(getSectionFromPath('/app/cms/scripts')).toBe('scripts');
  expect(getSectionFromPath('/app/dashboard/infrastructure')).toBe(
    'infrastructure',
  );
  expect(getSectionFromPath('/app/web/actions')).toBe('actions');
  expect(getSectionFromPath('/unknown')).toBe('overview');
});

test('section helpers build deep-linkable per-app section paths', () => {
  expect(getAppPath('web', 'overview')).toBe('/app/web');
  expect(getAppPath('cms', 'scripts')).toBe('/app/cms/scripts');
  expect(getAppPath('dashboard', 'actions')).toBe('/app/dashboard/actions');
});
