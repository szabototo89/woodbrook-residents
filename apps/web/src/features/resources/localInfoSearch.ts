import {
  resourceCategoryOrder,
  type ResourceCategoryFilter,
} from './resourceDirectory';

export type LocalInfoFilters = {
  query: string;
  category: ResourceCategoryFilter;
  outOfHoursOnly: boolean;
};

export type LocalInfoSearchParams = {
  q?: string;
  category?: string;
  ooh?: '1';
};

function parseQuery(value: unknown): string {
  return typeof value === 'string' ? value.slice(0, 120) : '';
}

function parseCategory(value: unknown): ResourceCategoryFilter {
  if (value === 'all') {
    return 'all';
  }
  const match = resourceCategoryOrder.find((entry) => entry === value);
  return match ?? 'all';
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

export function serializeLocalInfoSearch(
  filters: LocalInfoFilters,
): LocalInfoSearchParams {
  const search: LocalInfoSearchParams = {};
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
