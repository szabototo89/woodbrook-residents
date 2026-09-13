import type { DashboardAction, DashboardApp, InfraLink } from './registry';

export function getAppByName(
  appList: DashboardApp[],
  name: string,
): DashboardApp | undefined {
  return appList.find((app) => app.name === name);
}

export function getAppInfraLinks(
  app: DashboardApp,
  links: InfraLink[],
): InfraLink[] {
  return links.filter((link) => app.infraGroups.includes(link.group));
}

export function getAppActions(
  appName: string,
  actionList: DashboardAction[],
): { appActions: DashboardAction[]; workspaceActions: DashboardAction[] } {
  const appActions = actionList.filter(
    (action) =>
      action.command.includes(`:${appName}`) ||
      action.command.includes(`apps/${appName}`),
  );
  const workspaceActions = actionList.filter(
    (action) =>
      !action.command.includes(`:${appName}`) &&
      !action.command.includes(`apps/${appName}`),
  );
  return { appActions, workspaceActions };
}
