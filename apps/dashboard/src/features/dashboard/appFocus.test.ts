import { expect, test } from 'vitest';

import { actions, apps, infraLinks } from './registry';
import { getAppActions, getAppByName, getAppInfraLinks } from './appFocus';

test('app focus resolves each tracked app by name', () => {
  for (const app of apps) {
    expect(getAppByName(apps, app.name)?.description).toBe(app.description);
  }
  expect(getAppByName(apps, 'unknown-app')).toBeUndefined();
});

test('app focus shows only the infra groups relevant to the app', () => {
  const web = getAppByName(apps, 'web');
  const cms = getAppByName(apps, 'cms');
  if (!web || !cms) throw new Error('registry apps missing');
  const webLinks = getAppInfraLinks(web, infraLinks);
  const cmsLinks = getAppInfraLinks(cms, infraLinks);
  expect(webLinks.length).toBeGreaterThan(0);
  expect(webLinks.every((link) => web.infraGroups.includes(link.group))).toBe(
    true,
  );
  expect(cmsLinks.some((link) => link.group === 'cms')).toBe(true);
  expect(webLinks.some((link) => link.group === 'cms')).toBe(false);
});

test('app focus splits app actions from workspace actions', () => {
  const { appActions, workspaceActions } = getAppActions('web', actions);
  expect(appActions.length).toBeGreaterThan(0);
  expect(
    appActions.every(
      (action) =>
        action.command.includes(':web') || action.command.includes('apps/web'),
    ),
  ).toBe(true);
  expect(workspaceActions.length).toBeGreaterThan(0);
  expect(
    workspaceActions.every(
      (action) =>
        !action.command.includes(':web') &&
        !action.command.includes('apps/web'),
    ),
  ).toBe(true);
});
