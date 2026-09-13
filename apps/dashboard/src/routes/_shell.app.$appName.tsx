import { createFileRoute, notFound } from '@tanstack/react-router';

import { getAppByName } from '../features/dashboard/appFocus';
import { apps } from '../features/dashboard/registry';
import { AppWorkspacePage } from '../features/workspace/AppWorkspacePage';

export const Route = createFileRoute('/_shell/app/$appName')({
  loader: ({ params }) => {
    const app = getAppByName(apps, params.appName);
    if (!app) throw notFound();
    return { app };
  },
  component: function AppWorkspaceRoute() {
    const { app } = Route.useLoaderData();
    return <AppWorkspacePage app={app} />;
  },
});
