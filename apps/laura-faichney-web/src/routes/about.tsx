import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '../features/site/SitePages';
import {
  LauraSanitySource,
  pageHeadFromSeo,
} from '../features/site/lauraSanity';

export const Route = createFileRoute('/about')({
  loader: () => new LauraSanitySource().loadAbout(),
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: 'About Laura',
      fallbackDescription:
        'Laura Faichney is an artist in Ireland creating colourful paintings, murals and bespoke pieces for homes, businesses and events.',
      path: '/about',
    }),
  component: AboutRoute,
});

function AboutRoute() {
  const data = Route.useLoaderData();
  return <AboutPage data={data} />;
}
