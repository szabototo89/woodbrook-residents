import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';

export function createCosmosRouter(element: ReactNode) {
  const rootRoute = createRootRoute({ component: () => element });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ['/'] }),
    routeTree: rootRoute,
  });
  void router.load();
  return router;
}

export function renderInCosmosRouter(element: ReactNode): ReactNode {
  return <RouterProvider router={createCosmosRouter(element)} />;
}
