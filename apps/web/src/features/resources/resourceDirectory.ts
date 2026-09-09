import type { Resource } from '../content/contentTypes';

export type ResourceCategory = Resource['category'];
export type ResourceCategoryFilter = ResourceCategory | 'all';

export const resourceCategoryOrder: ResourceCategory[] = [
  'health',
  'trades',
  'professional',
  'care',
  'transport',
  'council',
  'community',
  'waste',
  'recreation',
  'safety',
];

export function toTelephoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export function getAvailableResourceCategories(resources: Resource[]) {
  const availableCategories = new Set(
    resources.map((resource) => resource.category),
  );

  return resourceCategoryOrder.filter((category) =>
    availableCategories.has(category),
  );
}

export function filterResources(
  resources: Resource[],
  query: string,
  category: ResourceCategoryFilter,
  outOfHoursOnly: boolean,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase('en-IE');

  return resources.filter((resource) => {
    if (category !== 'all' && resource.category !== category) {
      return false;
    }

    if (outOfHoursOnly && !resource.outOfHours) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      resource.title,
      resource.category,
      resource.serviceType,
      resource.description,
      resource.phone,
      resource.email,
      resource.documentLabel,
      ...resource.details.flatMap((detail) => [detail.label, detail.value]),
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('en-IE');

    return searchableText.includes(normalizedQuery);
  });
}
