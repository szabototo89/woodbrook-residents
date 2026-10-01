// Loaded only by Playwright and its preview server, never by the app build.
import { isGalleryQuery, withGalleryFixture } from './gallery-data.mjs';

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = input instanceof globalThis.Request ? input.url : String(input);
  const response = await originalFetch(input, init);
  if (!isGalleryQuery(url) || !response.ok) return response;
  return new globalThis.Response(
    JSON.stringify(withGalleryFixture(await response.json())),
    {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
