import { createFileRoute } from '@tanstack/react-router';

import {
  createBreadcrumbJsonLd,
  createProjectJsonLd,
} from '../../app/seoStructuredData';
import { createPageHead, resolveSiteUrl } from '../../app/siteMetadata';
import { getProjectBySlug } from '../../features/content/contentApi';
import { ProjectDetailPage } from '../../features/projects/ProjectDetailPage';

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => getProjectBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const path = `/projects/${params.slug}`;
    if (!loaderData) {
      return createPageHead({
        title: 'Project unavailable',
        description: 'This Woodbrook Residents project is unavailable.',
        path,
        robots: 'noindex',
      });
    }
    const siteUrl = resolveSiteUrl(import.meta.env);
    return createPageHead({
      title: loaderData.title,
      description: loaderData.summary,
      path,
      ogType: 'article',
      publishedTime: loaderData.updatedOn,
      modifiedTime: loaderData.sourceReviewedOn,
      jsonLd: [
        createBreadcrumbJsonLd({
          siteUrl,
          items: [
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: loaderData.title, path },
          ],
        }),
        createProjectJsonLd({
          siteUrl,
          path,
          headline: loaderData.title,
          description: loaderData.summary,
          imagePath: loaderData.imagePath,
          dateModified: loaderData.sourceReviewedOn,
        }),
      ],
    });
  },
  component: ProjectDetailPage,
});
