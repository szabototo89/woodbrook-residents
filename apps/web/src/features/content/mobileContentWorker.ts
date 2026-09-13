import { createMobileContentResponse } from './mobileContentResponse';
import type { ContentSnapshot } from './contentTypes';

export type MobileContentWorkerEnvironment = {
  ASSETS: { fetch(request: Request): Promise<Response> };
};

type SnapshotLoader<Environment> = (
  environment: Environment,
) => Promise<ContentSnapshot>;

export function createMobileContentWorker<
  Environment extends MobileContentWorkerEnvironment,
>(loadSnapshot: SnapshotLoader<Environment>) {
  return {
    async fetch(request: Request, environment: Environment) {
      const isContentEndpoint =
        new URL(request.url).pathname === '/api/mobile-content';
      if (!isContentEndpoint) return environment.ASSETS.fetch(request);
      if (request.method !== 'GET') {
        return new Response(null, { status: 405, headers: { Allow: 'GET' } });
      }
      return createMobileContentResponse(
        () => loadSnapshot(environment),
        console.error,
      );
    },
  };
}
