import { formatLabel } from '../content/contentFormatting';
import type { CommunityEvent, ContentSnapshot } from '../content/contentTypes';

export const searchCategories = [
  { value: 'all', label: 'All' },
  { value: 'updates', label: 'Updates' },
  { value: 'projects', label: 'Projects' },
  { value: 'events', label: 'Events' },
  { value: 'services', label: 'Services' },
] as const;

export type SearchCategory = (typeof searchCategories)[number]['value'];
export type SearchParams = { q: string; category: SearchCategory };
export type SearchResult = {
  id: string;
  category: Exclude<SearchCategory, 'all'>;
  title: string;
  summary: string;
  href: string;
  badge: string;
  tone: 'green' | 'red' | 'blue' | 'yellow';
  typeLabel: string;
  sourceName?: string;
  date?: string;
  imagePath?: string;
  event?: CommunityEvent;
  searchText: string;
};

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

export function buildSearchIndex(
  snapshot: ContentSnapshot,
  now: string,
): SearchResult[] {
  return [
    ...snapshot.updates.map((item): SearchResult => ({
      id: `update:${item.documentId}`,
      category: 'updates',
      href: `/updates/${item.slug}`,
      title: item.title,
      summary: item.summary,
      badge: 'Local update',
      tone: 'green',
      typeLabel: formatLabel(item.kind),
      sourceName: item.sourceName,
      date: item.publishedOn,
      imagePath: item.imagePath,
      searchText: `${item.title} ${item.summary} ${item.body} ${item.kind} ${item.sourceName}`,
    })),
    ...snapshot.surveys.map((item): SearchResult => ({
      id: `survey:${item.documentId}`,
      category: 'updates',
      href: `/surveys/${item.slug}`,
      title: item.title,
      summary: item.summary,
      badge: `Consultation ${item.stage}`,
      tone: item.stage === 'closed' ? 'red' : 'green',
      typeLabel: 'Consultation',
      sourceName: item.sourceName,
      date: item.sourceReviewedOn,
      searchText: `${item.title} ${item.summary} ${item.sourceName}`,
    })),
    ...snapshot.projects.map((item): SearchResult => ({
      id: `project:${item.documentId}`,
      category: 'projects',
      href: `/projects/${item.slug}`,
      title: item.title,
      summary: item.summary,
      badge: `${formatLabel(item.stage)} project`,
      tone: 'green',
      typeLabel: 'Project',
      sourceName: item.sourceName,
      date: item.updatedOn,
      imagePath: item.imagePath,
      searchText: `${item.title} ${item.summary} ${item.details} ${item.category} ${item.sourceName}`,
    })),
    ...snapshot.events.map((item): SearchResult => ({
      id: `event:${item.documentId}`,
      category: 'events',
      href: `/events/${item.slug}`,
      title: item.title,
      summary: item.summary,
      badge:
        new Date(item.endsAt ?? item.startsAt) < new Date(now)
          ? 'Past event'
          : 'Upcoming event',
      tone: 'yellow',
      typeLabel: 'Event',
      event: item,
      searchText: `${item.title} ${item.summary} ${item.location}`,
    })),
    ...snapshot.resources.map((item): SearchResult => ({
      id: `service:${item.documentId}`,
      category: 'services',
      href: `/local-info/${item.slug}`,
      title: item.title,
      summary: item.description,
      badge: 'Local service',
      tone: 'blue',
      typeLabel: formatLabel(item.category),
      sourceName: item.sourceName,
      date: item.sourceReviewedOn,
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
