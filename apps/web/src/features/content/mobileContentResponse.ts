import type { ContentSnapshot } from './contentTypes';

type SnapshotLoader = () => Promise<ContentSnapshot>;

export async function createMobileContentResponse(
  loadSnapshot: SnapshotLoader,
  reportError: (error: unknown) => void,
) {
  try {
    return Response.json(await loadSnapshot(), {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    reportError(error);
    return Response.json(
      { error: 'Content is temporarily unavailable.' },
      { status: 503 },
    );
  }
}
