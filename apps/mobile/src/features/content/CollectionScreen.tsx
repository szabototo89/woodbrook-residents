import { useState } from '@lynx-js/react';

import type { CollectionKey, CollectionModel, Route } from './contentModels.js';
import { CardFeed, type FeedVariant } from './CardFeed.js';

type Props = {
  collection: CollectionKey;
  model: CollectionModel;
  navigate: (route: Route) => void;
};

const updateFilters = ['All', 'Transport', 'Planning', 'Parks'] as const;

function variantFor(collection: CollectionKey): FeedVariant {
  if (collection === 'updates') return 'updates';
  if (collection === 'events') return 'events';
  if (collection === 'resources') return 'services';
  return 'default';
}

export function CollectionScreen(props: Props) {
  const [updateFilter, setUpdateFilter] = useState<string>('All');
  const [eventTab, setEventTab] = useState<'upcoming' | 'past'>('upcoming');

  const visibleCards =
    props.collection === 'updates' && updateFilter !== 'All'
      ? props.model.cards.filter((card) =>
          card.meta.toLowerCase().includes(updateFilter.toLowerCase()),
        )
      : props.model.cards;

  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="page-title">{props.model.title}</text>
        <text className="page-copy">{props.model.intro}</text>
      </view>

      {props.collection === 'updates' ? (
        <scroll-view className="filter-row" scroll-orientation="horizontal">
          {updateFilters.map((filter) => (
            <text
              className={`filter-chip ${updateFilter === filter ? 'filter-chip-active' : ''}`}
              key={filter}
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label={
                updateFilter === filter ? `${filter}, selected` : filter
              }
              bindtap={() => setUpdateFilter(filter)}
            >
              {filter}
            </text>
          ))}
        </scroll-view>
      ) : null}

      {props.collection === 'events' ? (
        <view className="segmented">
          <text
            className={`segment-option ${eventTab === 'upcoming' ? 'segment-option-active' : ''}`}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={
              eventTab === 'upcoming' ? 'Upcoming, selected' : 'Upcoming'
            }
            bindtap={() => setEventTab('upcoming')}
          >
            Upcoming
          </text>
          <text
            className={`segment-option ${eventTab === 'past' ? 'segment-option-active' : ''}`}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={
              eventTab === 'past' ? 'Past, selected' : 'Past'
            }
            bindtap={() => setEventTab('past')}
          >
            Past
          </text>
        </view>
      ) : null}

      {props.collection === 'events' && eventTab === 'past' ? (
        <view className="card-list">
          <text className="empty-copy">Past events will appear here.</text>
        </view>
      ) : (
        <CardFeed
          cards={visibleCards}
          actionLabel="Read more →"
          emptyLabel={props.model.empty}
          variant={variantFor(props.collection)}
          onSelect={(slug) =>
            props.navigate({
              name: 'detail',
              collection: props.collection,
              slug,
            })
          }
        />
      )}
      <view className="scroll-spacer" />
    </scroll-view>
  );
}
