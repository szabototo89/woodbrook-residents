export async function loadContent<T>(
  load: () => Promise<T>,
  fallback: T,
  failOnError: boolean,
): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (failOnError) {
      throw new Error('Static site build could not load required content.', {
        cause: error,
      });
    }

    return fallback;
  }
}
