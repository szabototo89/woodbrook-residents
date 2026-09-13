import { createFileRoute } from '@tanstack/react-router';

import { actions } from '../features/dashboard/registry';
import { ActivityPage } from '../features/views/ActivityPage';

export const Route = createFileRoute('/_shell/activity/')({
  component: function ActivityRoute() {
    return <ActivityPage actions={actions} />;
  },
});
