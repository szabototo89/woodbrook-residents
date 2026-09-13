import { createFileRoute, notFound } from '@tanstack/react-router';

import type { AppSection } from '../features/dashboard/appFocus';
import { getAppByName } from '../features/dashboard/appFocus';
import { apps } from '../features/dashboard/registry';
import { AppActionsSection } from '../features/workspace/AppActionsSection';
import { AppInfrastructureSection } from '../features/workspace/AppInfrastructureSection';
import { AppScriptsSection } from '../features/workspace/AppScriptsSection';

const SECTIONS: AppSection[] = ['scripts', 'infrastructure', 'actions'];

export const Route = createFileRoute('/_shell/app/$appName/$section')({
  loader: ({ params }) => {
    const app = getAppByName(apps, params.appName);
    const section = SECTIONS.find((entry) => entry === params.section);
    if (!app || !section) throw notFound();
    return { app, section };
  },
  component: function AppSectionRoute() {
    const { app, section } = Route.useLoaderData();
    if (section === 'scripts') return <AppScriptsSection app={app} />;
    if (section === 'infrastructure')
      return <AppInfrastructureSection app={app} />;
    return <AppActionsSection app={app} />;
  },
});
