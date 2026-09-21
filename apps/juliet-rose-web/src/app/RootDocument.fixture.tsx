import { renderToStaticMarkup } from 'react-dom/server';
import { RouterProvider } from '@tanstack/react-router';

import { createCosmosRouter } from '../cosmosRouter';
import { RootDocument } from './RootDocument';

export const rootDocumentRouter = createCosmosRouter(
  <RootDocument>
    <main id="main-content">
      <p>Cosmos preview content</p>
    </main>
  </RootDocument>,
);

await rootDocumentRouter.load();

// React cannot mount a nested <html> element inside the Cosmos renderer
// container, so this fixture previews the exact static markup the server
// sends for the document shell instead of a live tree.
const rootDocumentMarkup = renderToStaticMarkup(
  <RouterProvider router={rootDocumentRouter} />,
);

export default <div dangerouslySetInnerHTML={{ __html: rootDocumentMarkup }} />;
