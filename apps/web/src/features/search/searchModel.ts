import type {
  CommunityEvent,
  ContentSnapshot,
  Update,
  Survey,
  Project,
  Resource,
} from '../content/contentTypes';

export const searchCategories = [
  { value: 'all', label: 'All' },
  { value: 'services', label: 'Services' },
  { value: 'updates', label: 'News' },
  { value: 'projects', label: 'Projects' },
  { value: 'events', label: 'Events' },
] as const;

export type SearchCategory = (typeof searchCategories)[number]['value'];
export type SearchParams = { q: string; category: SearchCategory };
export type SearchResult = {
  id: string;
  title: string;
  href: string;
  searchText: string;
} & (
  | { kind: 'update'; category: 'updates'; record: Update }
  | { kind: 'survey'; category: 'updates'; record: Survey }
  | { kind: 'project'; category: 'projects'; record: Project }
  | { kind: 'event'; category: 'events'; record: CommunityEvent }
  | { kind: 'service'; category: 'services'; record: Resource }
);

export function parseSearchParams(
  search: Record<string, unknown>,
): SearchParams {
  return {
    q: typeof search.q === 'string' ? search.q.trim().slice(0, 120) : '',
    category:
      searchCategories.find((entry) => entry.value === search.category)
        ?.value ?? 'all',
  };
}

export function buildSearchIndex(snapshot: ContentSnapshot): SearchResult[] {
  return [
    ...snapshot.updates.map((item): SearchResult => ({
      id: `update:${item.documentId}`,
      category: 'updates',
      href: `/updates/${item.slug}`,
      title: item.title,
      kind: 'update',
      record: item,
      searchText: `${item.title} ${item.summary} ${item.body} ${item.kind} ${item.sourceName}`,
    })),
    ...snapshot.surveys.map((item): SearchResult => ({
      id: `survey:${item.documentId}`,
      category: 'updates',
      href: `/surveys/${item.slug}`,
      title: item.title,
      kind: 'survey',
      record: item,
      searchText: `${item.title} ${item.summary} ${item.sourceName}`,
    })),
    ...snapshot.projects.map((item): SearchResult => ({
      id: `project:${item.documentId}`,
      category: 'projects',
      href: `/projects/${item.slug}`,
      title: item.title,
      kind: 'project',
      record: item,
      searchText: `${item.title} ${item.summary} ${item.details} ${item.category} ${item.sourceName}`,
    })),
    ...snapshot.events.map((item): SearchResult => ({
      id: `event:${item.documentId}`,
      category: 'events',
      href: `/events/${item.slug}`,
      title: item.title,
      kind: 'event',
      record: item,
      searchText: `${item.title} ${item.summary} ${item.location}`,
    })),
    ...snapshot.resources.map((item): SearchResult => ({
      id: `service:${item.documentId}`,
      category: 'services',
      href: `/local-info/${item.slug}`,
      title: item.title,
      kind: 'service',
      record: item,
      searchText: `${item.title} ${item.description} ${item.serviceType} ${item.category} ${item.sourceName} ${item.details.map((detail) => `${detail.label} ${detail.value}`).join(' ')}`,
    })),
  ];
}

export function searchContent(index: SearchResult[], params: SearchParams) {
  const terms = params.q
    .toLocaleLowerCase('en-IE')
    .split(/\s+/)
    .filter(Boolean);
  const matches = terms.length
    ? index.filter((item) =>
        terms.every((term) =>
          item.searchText.toLocaleLowerCase('en-IE').includes(term),
        ),
      )
    : [];
  const counts = {
    all: matches.length,
    updates: matches.filter((item) => item.category === 'updates').length,
    projects: matches.filter((item) => item.category === 'projects').length,
    events: matches.filter((item) => item.category === 'events').length,
    services: matches.filter((item) => item.category === 'services').length,
  };
  return {
    counts,
    results:
      params.category === 'all'
        ? matches
        : matches.filter((item) => item.category === params.category),
  };
}
