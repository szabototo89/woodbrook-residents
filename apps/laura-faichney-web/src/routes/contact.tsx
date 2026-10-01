import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { ContactPage } from '../features/site/SitePages';
import { LauraSanitySource } from '../features/site/lauraSanity';

export const Route = createFileRoute('/contact')({
  loader: () => new LauraSanitySource().loadSettings(),
  head: () =>
    createPageHead({
      title: 'Contact',
      description:
        'Contact Laura Faichney about a commissioned painting, mural, event or creative session.',
      path: '/contact',
    }),
  component: ContactRoute,
});

function ContactRoute() {
  const settings = Route.useLoaderData();
  return <ContactPage settings={settings} />;
}
