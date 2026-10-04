import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../features/home/HomePage';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Forma Studio | Digital services for local businesses' },
      {
        name: 'description',
        content:
          'Modern websites, local SEO, booking tools and friendly ongoing support. Simple digital services to help your local business grow.',
      },
      {
        property: 'og:title',
        content: 'Forma Studio | Digital services for local businesses',
      },
      {
        property: 'og:description',
        content:
          'Modern websites and the tools your local business needs to grow.',
      },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: HomePage,
});
