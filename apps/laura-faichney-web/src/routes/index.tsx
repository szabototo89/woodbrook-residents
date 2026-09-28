import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../features/site/SitePages';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Laura Faichney | All Things Art' },
      {
        name: 'description',
        content:
          'Colourful paintings, murals, signage, facepainting and art tutoring by Laura Faichney.',
      },
    ],
  }),
  component: HomePage,
});
