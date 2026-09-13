import { createFileRoute } from '@tanstack/react-router';

import { ApplicationsPage } from '../features/applications/ApplicationsPage';

export const Route = createFileRoute('/_shell/applications')({
  component: ApplicationsPage,
});
