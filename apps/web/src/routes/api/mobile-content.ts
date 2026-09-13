import { createFileRoute } from '@tanstack/react-router';

import { createMobileContentResponse } from '../../features/content/mobileContentResponse';
import { getContentSnapshot } from '../../features/content/contentSnapshot';

export const Route = createFileRoute('/api/mobile-content')({
  server: {
    handlers: {
      GET: () =>
        createMobileContentResponse(
          () => getContentSnapshot(false),
          console.error,
        ),
    },
  },
});
