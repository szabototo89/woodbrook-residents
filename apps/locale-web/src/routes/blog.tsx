import { createFileRoute } from '@tanstack/react-router';
import { BlogPage } from '../features/blog/BlogPage';

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      { title: 'Locale Journal | Ideas for local businesses' },
      {
        name: 'description',
        content:
          'Practical guides to website design, local search and keeping your business content useful. Read the Locale journal.',
      },
      {
        property: 'og:title',
        content: 'Locale Journal | Ideas for local businesses',
      },
    ],
  }),
  component: BlogPage,
});
