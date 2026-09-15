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

export function LocalInfoScreen({
  content,
  navigate,
  filters,
  onFiltersChange,
}: Props) {
  const { query, category, outOfHoursOnly } = filters;
  const copy = getCollectionModel(content, 'resources');
  const resources = filterResources(
    content.resources,
    query,
    category,
    outOfHoursOnly,
  );
  const countLabel = `${resources.length} ${resources.length === 1 ? 'contact' : 'contacts'}`;

  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="page-title">{copy.title}</text>
        <text className="page-copy">{copy.intro}</text>
      </view>
      {content.resources.length === 0 ? (
        <text className="empty-copy directory-padding">{copy.empty}</text>
      ) : (
        <view className="directory-tools-mobile">
          <text className="fact-label">What do you need?</text>
          <input
            className="search-input"
            placeholder="Try plumber, GP, pharmacy…"
            default-value={query}
            bindinput={(event) =>
              onFiltersChange({ ...filters, query: event.detail.value })
            }
          />
          <scroll-view className="filter-row" scroll-orientation="horizontal">
            <text
              className={`filter-chip ${category === 'all' ? 'filter-chip-active' : ''}`}
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label={category === 'all' ? 'All, selected' : 'All'}
              bindtap={() => onFiltersChange({ ...filters, category: 'all' })}
            >
              All
            </text>
            {getResourceCategories(content.resources).map((value) => (
              <text
                className={`filter-chip ${category === value ? 'filter-chip-active' : ''}`}
                key={value}
                accessibility-element={true}
                accessibility-trait="button"
                accessibility-label={
                  category === value ? `${value}, selected` : value
                }
                bindtap={() => onFiltersChange({ ...filters, category: value })}
              >
                {value}
              </text>
            ))}
          </scroll-view>
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
              onFiltersChange({ ...filters, outOfHoursOnly: !outOfHoursOnly })
            }
          >
            Out-of-hours only
          </text>
          <text className="results-count">{countLabel}</text>
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
        onSelect={(slug) =>
          navigate({ name: 'detail', collection: 'resources', slug })
        }
      />
      {content.resources.length > 0 && resources.length === 0 ? (
        <view className="card-list">
          <view className="content-card">
            <text className="card-title">No matching contacts</text>
            <text className="card-copy">
              Try a broader search or clear one of the filters.
            </text>
          </view>
        </view>
      ) : null}
      {content.resources.length > 0 ? (
        <text className="disclaimer directory-padding">
          This is a curated starting set, not a complete directory or a
          recommendation. Listings are unpaid. Check availability,
          qualifications, and costs with the provider.
        </text>
      ) : null}
    </scroll-view>
  );
}
