import { useState } from '@lynx-js/react';

import {
  filterResources,
  getCollectionModel,
  getResourceCategories,
} from './contentModels.js';
import type { Route } from './contentModels.js';
import type { ContentSnapshot } from './contentTypes.js';

type Props = {
  content: ContentSnapshot;
  navigate: (route: Route) => void;
};

export function LocalInfoScreen({ content, navigate }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [outOfHoursOnly, setOutOfHoursOnly] = useState(false);
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
        <text className="eyebrow">{copy.eyebrow}</text>
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
            bindinput={(event) => setQuery(event.detail.value)}
          />
          <scroll-view className="filter-row" scroll-orientation="horizontal">
            <text
              className={`filter-chip ${category === 'all' ? 'filter-chip-active' : ''}`}
              bindtap={() => setCategory('all')}
            >
              All
            </text>
            {getResourceCategories(content.resources).map((value) => (
              <text
                className={`filter-chip ${category === value ? 'filter-chip-active' : ''}`}
                key={value}
                bindtap={() => setCategory(value)}
              >
                {value}
              </text>
            ))}
          </scroll-view>
          <text
            className={`filter-chip ${outOfHoursOnly ? 'filter-chip-active' : ''}`}
            bindtap={() => setOutOfHoursOnly((value) => !value)}
          >
            Out-of-hours only
          </text>
          <text className="results-count">{countLabel}</text>
        </view>
      )}
      <view className="card-list">
        {content.resources.length > 0 && resources.length === 0 ? (
          <view className="content-card">
            <text className="card-title">No matching contacts</text>
            <text className="card-copy">
              Try a broader search or clear one of the filters.
            </text>
          </view>
        ) : null}
        {resources.map((resource) => (
          <view
            className="content-card"
            key={resource.slug}
            bindtap={() =>
              navigate({
                name: 'detail',
                collection: 'resources',
                slug: resource.slug,
              })
            }
            accessibility-element={true}
            accessibility-trait="button"
          >
            <text className="card-meta">
              {resource.category} · {resource.serviceType}
            </text>
            <text className="card-title">{resource.title}</text>
            <text className="card-copy">{resource.description}</text>
            <text className="card-action">View contact →</text>
          </view>
        ))}
        {content.resources.length > 0 ? (
          <text className="disclaimer">
            This is a curated starting set, not a complete directory or a
            recommendation. Listings are unpaid. Check availability,
            qualifications, and costs with the provider.
          </text>
        ) : null}
      </view>
    </scroll-view>
  );
}
