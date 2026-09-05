import { createFileRoute } from '@tanstack/react-router';

import { ReportIssuePage } from '../features/reporting/ReportIssuePage';

export const Route = createFileRoute('/report')({
  component: ReportIssuePage,
});
