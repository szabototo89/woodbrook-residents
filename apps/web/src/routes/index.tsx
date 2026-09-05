import { createFileRoute } from '@tanstack/react-router';

import { getHomeContent } from '../features/content/contentApi';
import { HomePage } from '../features/home/HomePage';

export const Route = createFileRoute('/')({
  loader: () => getHomeContent(),
  component: HomePage,
});
