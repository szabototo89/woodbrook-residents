import type { DashboardAction, DashboardApp, InfraLink } from './registry';

export type AppSection = 'overview' | 'scripts' | 'infrastructure' | 'actions';

const SECTIONS: AppSection[] = [
  'overview',
  'scripts',
  'infrastructure',
  'actions',
];

export function getSectionFromPath(pathname: string): AppSection {
  const segments = pathname.split('/').filter((part) => part.length > 0);
  const candidate = segments[2];
  return SECTIONS.find((section) => section === candidate) ?? 'overview';
}

export function getAppPath(appName: string, section: AppSection): string {
  return section === 'overview'
    ? `/app/${appName}`
    : `/app/${appName}/${section}`;
}

const SELECTED_APP_KEY = 'dashboard.selectedApp';

export function readSelectedApp(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(SELECTED_APP_KEY) ?? fallback;
}

export function persistSelectedApp(appName: string): void {
  window.localStorage.setItem(SELECTED_APP_KEY, appName);
}
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
