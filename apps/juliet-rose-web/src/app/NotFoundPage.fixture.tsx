import { RouterProvider } from '@tanstack/react-router';

import { createCosmosRouter } from '../cosmosRouter';
import { NotFoundPage } from './NotFoundPage';

export const notFoundPageRouter = createCosmosRouter(<NotFoundPage />);

export default <RouterProvider router={notFoundPageRouter} />;
