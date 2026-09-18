import { resourceCategoryOrder, type ResourceCategoryFilter } from './resourceDirectory';

export type LocalInfoFilters = {
  query: string;
  category: ResourceCategoryFilter;
  outOfHoursOnly: boolean;
};

export const defaultLocalInfoFilters: LocalInfoFilters = {
  query: '',
  category: 'all',
  outOfHoursOnly: false,
};

function parseQuery(value: unknown): string {
  return typeof value === 'string' ? value.slice(0, 120) : '';
}

function parseCategory(value: unknown): ResourceCategoryFilter {
  if (value === 'all') {
    return 'all';
  }
  if (
    typeof value === 'string' &&
    (resourceCategoryOrder as string[]).includes(value)
  ) {
    return value as ResourceCategoryFilter;
  }
  return 'all';
}

function parseOutOfHours(value: unknown): boolean {
  return value === '1' || value === true;
}

export function parseLocalInfoSearch(
  search: Record<string, unknown>,
): LocalInfoFilters {
  return {
    query: parseQuery(search.q),
    category: parseCategory(search.category),
    outOfHoursOnly: parseOutOfHours(search.ooh),
  };
}

export function serializeLocalInfoSearch(filters: LocalInfoFilters): Record<
  string,
  string
> {
  const search: Record<string, string> = {};
  const query = filters.query.slice(0, 120);
  if (query) {
    search.q = query;
  }
  if (filters.category !== 'all') {
    search.category = filters.category;
  }
  if (filters.outOfHoursOnly) {
    search.ooh = '1';
  }
  return search;
}
