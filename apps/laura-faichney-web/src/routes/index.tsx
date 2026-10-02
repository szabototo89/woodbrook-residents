import lauraContent from 'virtual:laura-content';
import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../features/site/SitePages';
import { pageHeadFromSeo } from '../features/site/lauraSanity';

export const Route = createFileRoute('/')({
  loader: () => lauraContent.home,
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: 'Laura Faichney All Things Art',
      fallbackDescription:
        'Colourful paintings, murals, signage, facepainting and art tutoring by Laura Faichney.',
      path: '/',
    }),
  component: HomeRoute,
});

function HomeRoute() {
  const data = Route.useLoaderData();
  return <HomePage data={data} />;
}
