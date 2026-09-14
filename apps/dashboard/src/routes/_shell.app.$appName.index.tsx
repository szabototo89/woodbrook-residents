import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_shell/app/$appName/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/environments/$envId',
      params: { envId: `${params.appName}-local` },
    });
  },
});
