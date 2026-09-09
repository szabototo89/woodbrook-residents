import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getProjectBySlug } from '../../features/content/contentApi';
import { ProjectDetailPage } from '../../features/projects/ProjectDetailPage';

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => getProjectBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) =>
    createPageHead({
      title: loaderData?.title ?? 'Project unavailable',
      description:
        loaderData?.summary ??
        'This Woodbrook Residents project is unavailable.',
      path: `/projects/${params.slug}`,
    }),
  component: ProjectDetailPage,
});
