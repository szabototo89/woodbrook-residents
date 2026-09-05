import { createFileRoute } from '@tanstack/react-router';

import { getProjects } from '../../features/content/contentApi';
import { ProjectsPage } from '../../features/projects/ProjectsPage';

export const Route = createFileRoute('/projects/')({
  loader: () => getProjects(),
  component: ProjectsPage,
});
