import { createFileRoute } from '@tanstack/react-router';

import { ActionsPage } from '../features/actions/ActionsPage';

export const Route = createFileRoute('/_shell/actions')({
  component: ActionsPage,
});
