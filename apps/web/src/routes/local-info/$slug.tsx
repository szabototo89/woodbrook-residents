import { createFileRoute } from '@tanstack/react-router';

import { createPageHead, resolveSiteUrl } from '../../app/siteMetadata';
import {
  composeLocalInfoDescription,
  createBreadcrumbJsonLd,
  createLocalServiceJsonLd,
} from '../../app/seoStructuredData';
import { getResourceBySlug } from '../../features/content/contentApi';
import { getDublinCalendarDate } from '../../features/resources/collectionScheduleUtils';
import { LocalServiceDetailPage } from '../../features/resources/LocalServiceDetailPage';

function resourceAddress(
  resource: { details: Array<{ label: string; value: string }> } | undefined,
): string | undefined {
  return resource?.details.find((detail) => detail.label === 'Address')?.value;
}

export const Route = createFileRoute('/local-info/$slug')({
  loader: async ({ params }) => ({
    resource: await getResourceBySlug({ data: { slug: params.slug } }),
    today: getDublinCalendarDate(),
  }),
  head: ({ loaderData, params }) => {
    const path = `/local-info/${params.slug}`;
    const resource = loaderData?.resource;
    if (!resource) {
      return createPageHead({
        title: 'Service unavailable',
        description:
          'This Woodbrook Residents local service listing is unavailable.',
        path,
        robots: 'noindex',
      });
    }
    const siteUrl = resolveSiteUrl(import.meta.env);
    const address = resourceAddress(resource);
    return createPageHead({
      title: resource.title,
      description: composeLocalInfoDescription({
        description: resource.description,
        phone: resource.phone,
        address,
      }),
      path,
      jsonLd: [
        createBreadcrumbJsonLd({
          siteUrl,
          items: [
            { name: 'Home', path: '/' },
            { name: 'Local information', path: '/local-info' },
            { name: resource.title, path },
          ],
        }),
        createLocalServiceJsonLd({
          siteUrl,
          path,
          name: resource.title,
          description: resource.description,
          phone: resource.phone,
          address,
          url: resource.url,
        }),
      ],
    });
  },
  component: LocalServiceDetailPage,
});
