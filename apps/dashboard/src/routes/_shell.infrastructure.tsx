import { createFileRoute } from '@tanstack/react-router';

import { InfrastructurePage } from '../features/infrastructure/InfrastructurePage';

export const Route = createFileRoute('/_shell/infrastructure')({
  component: InfrastructurePage,
});
