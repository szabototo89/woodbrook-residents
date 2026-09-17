import { createFileRoute } from '@tanstack/react-router';

import { createEventJsonLd } from '../../app/seoStructuredData';
import { createPageHead, resolveSiteUrl } from '../../app/siteMetadata';
import { getEventBySlug } from '../../features/content/contentApi';
import { EventDetailPage } from '../../features/events/EventDetailPage';

export const Route = createFileRoute('/events/$slug')({
  loader: ({ params }) => getEventBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const path = `/events/${params.slug}`;
    if (!loaderData) {
      return createPageHead({
        title: 'Event unavailable',
        description: 'This Woodbrook Residents event is unavailable.',
        path,
      });
    }
    const siteUrl = resolveSiteUrl(import.meta.env);
    return createPageHead({
      title: loaderData.title,
      description: loaderData.summary,
      path,
      jsonLd: createEventJsonLd({
        siteUrl,
        path,
        name: loaderData.title,
        description: loaderData.summary,
        startDate: loaderData.startsAt,
        endDate: loaderData.endsAt,
        locationName: loaderData.location,
      }),
    });
  },
  component: EventDetailPage,
});
