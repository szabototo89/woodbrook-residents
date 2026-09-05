import { createFileRoute } from '@tanstack/react-router';

import { getUpdates } from '../../features/content/contentApi';
import { UpdatesPage } from '../../features/updates/UpdatesPage';

export const Route = createFileRoute('/updates/')({
  loader: () => getUpdates(),
  component: UpdatesPage,
});
