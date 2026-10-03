import { createFileRoute } from '@tanstack/react-router';
import { BlogPage } from '../features/blog/BlogPage';

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      { title: 'Forma Studio Journal | Ideas for local businesses' },
      {
        name: 'description',
        content:
          'Practical guides to website design, local search and keeping your business content useful. Read the Forma Studio journal.',
      },
      {
        property: 'og:title',
        content: 'Forma Studio Journal | Ideas for local businesses',
      },
    ],
  }),
  component: BlogPage,
});
