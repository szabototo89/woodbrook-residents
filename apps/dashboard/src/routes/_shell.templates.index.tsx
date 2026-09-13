import { createFileRoute } from '@tanstack/react-router';

import { apps } from '../features/dashboard/registry';
import { TemplatesPage } from '../features/views/TemplatesPage';

export const Route = createFileRoute('/_shell/templates/')({
  component: function TemplatesRoute() {
    return <TemplatesPage apps={apps} />;
  },
});
