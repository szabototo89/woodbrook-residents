import { createFileRoute } from '@tanstack/react-router';

import { getProjectBySlug } from '../../features/content/contentApi';
import { ProjectDetailPage } from '../../features/projects/ProjectDetailPage';

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => getProjectBySlug({ data: { slug: params.slug } }),
  component: ProjectDetailPage,
});
