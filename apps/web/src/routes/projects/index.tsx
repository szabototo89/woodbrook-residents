import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getProjects } from '../../features/content/contentApi';
import { ProjectsPage } from '../../features/projects/ProjectsPage';

export const Route = createFileRoute('/projects/')({
  loader: () => getProjects(),
  head: () =>
    createPageHead({
      title: 'Projects',
      description:
        'Follow local projects, their latest known status, next steps, and official sources.',
      path: '/projects',
    }),
  component: ProjectsPage,
});
