import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';

import { getAppByName } from '../features/dashboard/appFocus';
import { apps } from '../features/dashboard/registry';
import {
  EnvironmentDetailPage,
  type EnvironmentTab,
} from '../features/environments/EnvironmentDetailPage';
import {
  getWorkspaceEnvironments,
  type WorkspaceEnvironment,
} from '../features/environments/environments';

const TABS: EnvironmentTab[] = [
  'overview',
  'scripts',
  'infrastructure',
  'actions',
  'logs',
];

export const Route = createFileRoute('/_shell/environments/$envId')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: EnvironmentTab } => {
    const tab = TABS.find((entry) => entry === search.tab);
    return tab ? { tab } : {};
  },
  loader: ({ params }) => {
    const env = getWorkspaceEnvironments(apps).find(
      (entry: WorkspaceEnvironment) => entry.id === params.envId,
    );
    const app = env ? getAppByName(apps, env.project) : undefined;
    if (!env || !app) throw notFound();
    return { env, app };
  },
  component: function EnvironmentDetailRoute() {
    const { env, app } = Route.useLoaderData();
    const { tab } = Route.useSearch();
    const navigate = useNavigate();

    return (
      <EnvironmentDetailPage
        env={env}
        app={app}
        tab={tab ?? 'overview'}
        onTabChange={(next) => {
          void navigate({
            to: '/environments/$envId',
            params: { envId: env.id },
            search: next === 'overview' ? {} : { tab: next },
          });
        }}
      />
    );
  },
});
