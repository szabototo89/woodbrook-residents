import { createFileRoute } from '@tanstack/react-router';

import { getResources } from '../features/content/contentApi';
import { LocalInfoPage } from '../features/resources/LocalInfoPage';

export const Route = createFileRoute('/local-info')({
  loader: () => getResources(),
  component: LocalInfoPage,
});
