import { createFileRoute } from '@tanstack/react-router';

import { infraLinks } from '../features/dashboard/registry';
import { InfrastructurePage } from '../features/views/InfrastructurePage';

export const Route = createFileRoute('/_shell/infrastructure/')({
  component: function InfrastructureRoute() {
    return <InfrastructurePage links={infraLinks} />;
  },
});
