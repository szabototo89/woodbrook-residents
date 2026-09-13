import { createFileRoute } from '@tanstack/react-router';

import { apps } from '../features/dashboard/registry';
import { ProjectsPage } from '../features/views/ProjectsPage';

export const Route = createFileRoute('/_shell/projects/')({
  component: function ProjectsRoute() {
    return <ProjectsPage apps={apps} />;
  },
});
