import { createFileRoute, notFound } from '@tanstack/react-router';

import { getAppByName } from '../features/dashboard/appFocus';
import { apps } from '../features/dashboard/registry';
import { AppOverviewSection } from '../features/workspace/AppOverviewSection';

export const Route = createFileRoute('/_shell/app/$appName/')({
  loader: ({ params }) => {
    const app = getAppByName(apps, params.appName);
    if (!app) throw notFound();
    return { app };
  },
  component: function AppOverviewRoute() {
    const { app } = Route.useLoaderData();
    return <AppOverviewSection app={app} />;
  },
});
