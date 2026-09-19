import {
  filterResources,
  getCollectionModel,
  getResourceCategories,
} from './contentModels.js';
import type { Route } from './contentModels.js';
import { CardFeed } from './CardFeed.js';
import type { ContentSnapshot } from './contentTypes.js';

export type LocalInfoFilters = {
  query: string;
  category: string;
  outOfHoursOnly: boolean;
};

type Props = {
  content: ContentSnapshot;
  navigate: (route: Route) => void;
  filters: LocalInfoFilters;
  onFiltersChange: (filters: LocalInfoFilters) => void;
};

const quickCategories = ['Health', 'Council', 'Transport'] as const;
const extraCategories = ['Parks', 'Safety', 'Community'] as const;

export function LocalInfoScreen(props: Props) {
  const { query, category, outOfHoursOnly } = props.filters;
  const copy = getCollectionModel(props.content, 'resources');
  const resources = filterResources(
    props.content.resources,
    query,
    category,
    outOfHoursOnly,
  );
  const countLabel = `${resources.length} ${resources.length === 1 ? 'contact' : 'contacts'}`;
  const knownCategories: readonly string[] = [
    ...quickCategories,
    ...extraCategories,
    'all',
  ];
  const dynamicCategories = getResourceCategories(
    props.content.resources,
  ).filter((value) => !knownCategories.includes(value));
  const visibleCategories = [
    ...quickCategories,
    ...extraCategories,
    ...dynamicCategories,
  ];

  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="page-title">{copy.title}</text>
        <text className="page-copy">{copy.intro}</text>
      </view>
      {props.content.resources.length === 0 ? (
        <text className="empty-copy directory-padding">{copy.empty}</text>
      ) : (
        <view className="directory-tools-mobile">
          <view className="search-wrap">
            <text className="search-icon">🔍</text>
            <input
              className="search-field"
              placeholder="Try plumber, GP, pharmacy…"
              default-value={query}
              accessibility-label="Search local services and contacts"
              bindinput={(event) =>
                props.onFiltersChange({
                  ...props.filters,
                  query: event.detail.value,
                })
              }
            />
          </view>
          <scroll-view className="filter-row" scroll-orientation="horizontal">
            <text
              className={`filter-chip ${category === 'all' ? 'filter-chip-active' : ''}`}
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label={category === 'all' ? 'All, selected' : 'All'}
              bindtap={() =>
                props.onFiltersChange({ ...props.filters, category: 'all' })
              }
            >
              All
            </text>
            {visibleCategories.map((value) => (
              <text
                className={`filter-chip ${category === value ? 'filter-chip-active' : ''}`}
                key={value}
                accessibility-element={true}
                accessibility-trait="button"
                accessibility-label={
                  category === value ? `${value}, selected` : value
                }
                bindtap={() =>
                  props.onFiltersChange({ ...props.filters, category: value })
                }
              >
                {value}
              </text>
            ))}
            <text
              className={`filter-chip ${outOfHoursOnly ? 'filter-chip-active' : ''}`}
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label={
                outOfHoursOnly
                  ? 'Out-of-hours only, selected'
                  : 'Out-of-hours only'
              }
              bindtap={() =>
                props.onFiltersChange({
                  ...props.filters,
                  outOfHoursOnly: !outOfHoursOnly,
                })
              }
            >
              Out-of-hours only
            </text>
          </scroll-view>
          <text
            className="results-count"
            accessibility-element={true}
            accessibility-label={`${countLabel} shown`}
          >
            {countLabel}
          </text>
        </view>
      )}
      <CardFeed
        cards={resources.map((resource) => ({
          slug: resource.slug,
          title: resource.title,
          summary: resource.description,
          meta: `${resource.category} · ${resource.serviceType}`,
        }))}
        actionLabel="View contact →"
        emptyLabel=""
        variant="services"
        onSelect={(slug) =>
          props.navigate({ name: 'detail', collection: 'resources', slug })
        }
      />
      {props.content.resources.length > 0 && resources.length === 0 ? (
        <view className="card-list">
          <view className="content-card">
            <text className="card-title">No matching contacts</text>
            <text className="card-copy">
              Try a broader search or clear one of the filters.
            </text>
          </view>
        </view>
      ) : null}
      {props.content.resources.length > 0 ? (
        <text className="disclaimer directory-padding">
          This is a curated starting set, not a complete directory or a
          recommendation. Listings are unpaid. Check availability,
          qualifications, and costs with the provider.
        </text>
      ) : null}
      <view className="scroll-spacer" />
    </scroll-view>
  );
}
