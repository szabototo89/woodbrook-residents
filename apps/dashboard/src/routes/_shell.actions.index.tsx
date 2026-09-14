import { createFileRoute } from '@tanstack/react-router';

import { actions } from '../features/dashboard/registry';
import { ActionsPage } from '../features/views/ActionsPage';

export const Route = createFileRoute('/_shell/actions/')({
  component: function ActionsRoute() {
    return <ActionsPage actions={actions} />;
  },
});
