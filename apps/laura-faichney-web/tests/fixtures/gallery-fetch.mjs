// Loaded only by the e2e build; normal builds never include these fixtures.
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
