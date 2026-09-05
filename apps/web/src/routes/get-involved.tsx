import { createFileRoute } from '@tanstack/react-router';

import { GetInvolvedPage } from '../features/involvement/GetInvolvedPage';

export const Route = createFileRoute('/get-involved')({
  component: GetInvolvedPage,
});
