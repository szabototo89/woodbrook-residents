import type { ContentSnapshot } from '../content/contentTypes';

export type SearchResult = {
  title: string;
  summary: string;
  type: string;
  href: string;
};

export function createSearchIndex(snapshot: ContentSnapshot): SearchResult[] {
  const collections = [
    { items: snapshot.updates, type: 'Update', path: '/updates' },
    { items: snapshot.projects, type: 'Project', path: '/projects' },
    { items: snapshot.events, type: 'Event', path: '/events' },
    { items: snapshot.surveys, type: 'Consultation', path: '/surveys' },
    {
      items: snapshot.resources.map((resource) => ({
        ...resource,
        summary: resource.description,
      })),
      type: 'Service',
      path: '/local-info',
    },
  ];
  return collections.flatMap((collection) =>
    collection.items.map((item) => ({
      title: item.title,
      summary: item.summary,
      type: collection.type,
      href: `${collection.path}/${encodeURIComponent(item.slug)}`,
    })),
  );
}

export function parseSearchQuery(value: unknown): string {
  return typeof value === 'string' ? value.slice(0, 120).trim() : '';
}

export function searchPublicContent(
  index: SearchResult[],
  query: string,
): SearchResult[] {
  const words = parseSearchQuery(query)
    .toLocaleLowerCase('en-IE')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return [];
  return index.filter((result) => {
    const text =
      `${result.title} ${result.summary} ${result.type}`.toLocaleLowerCase(
        'en-IE',
      );
    return words.every((word) => text.includes(word));
  });
}
