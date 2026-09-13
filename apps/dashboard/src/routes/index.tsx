import { createFileRoute, redirect } from '@tanstack/react-router';

import { apps } from '../features/dashboard/registry';
import { readSelectedApp } from '../features/dashboard/appFocus';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const stored = readSelectedApp('web');
    const target = apps.some((app) => app.name === stored) ? stored : 'web';
    throw redirect({ to: '/app/$appName', params: { appName: target } });
  },
});
