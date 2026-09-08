export async function loadCmsContent<T>(
  load: () => Promise<T>,
  fallback: T,
  failOnError: boolean,
): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (failOnError) {
      throw new Error(
        'Static site build could not load required content from Strapi.',
        { cause: error },
      );
    }

    return fallback;
  }
}
