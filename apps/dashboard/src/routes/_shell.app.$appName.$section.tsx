import { createFileRoute, redirect } from '@tanstack/react-router';

import type { EnvironmentTab } from '../features/environments/EnvironmentDetailPage';

const SECTION_TO_TAB: Record<string, EnvironmentTab> = {
  overview: 'overview',
  scripts: 'scripts',
  infrastructure: 'infrastructure',
  actions: 'actions',
};

export const Route = createFileRoute('/_shell/app/$appName/$section')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/environments/$envId',
      params: { envId: `${params.appName}-local` },
      search: { tab: SECTION_TO_TAB[params.section] ?? 'overview' },
    });
  },
});
