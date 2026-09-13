import { createFileRoute } from '@tanstack/react-router';

import { apps } from '../features/dashboard/registry';
import { getWorkspaceEnvironments } from '../features/environments/environments';
import { OverviewPage } from '../features/views/OverviewPage';

export const Route = createFileRoute('/_shell/overview/')({
  component: function OverviewRoute() {
    return <OverviewPage environments={getWorkspaceEnvironments(apps)} />;
  },
});
