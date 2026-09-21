import woodbrookImage from '../../../../web/public/images/woodbrook-coast-aerial-768.jpg';

import type { CardModel } from './contentModels.js';

export type FeedVariant = 'updates' | 'events' | 'services' | 'default';

type Props = {
  cards: CardModel[];
  actionLabel: string;
  emptyLabel: string;
  onSelect: (slug: string) => void;
  variant?: FeedVariant;
};

function eventDateBadge(meta: string): { day: string; month: string } {
  const dayMatch = meta.match(/(\d{1,2})\s+([A-Za-z]{3,})/);
  if (dayMatch?.[1] && dayMatch?.[2]) {
    return { day: dayMatch[1], month: dayMatch[2].slice(0, 3).toUpperCase() };
  }
  return { day: '•', month: 'DATE' };
}

function serviceIconFor(title: string, meta: string): string {
  const haystack = `${title} ${meta}`.toLowerCase();
  if (haystack.includes('health') || haystack.includes('gp')) return '♡';
  if (haystack.includes('council') || haystack.includes('bin')) return '🏛';
  if (haystack.includes('transport') || haystack.includes('bus')) return '🚌';
  if (haystack.includes('park') || haystack.includes('green')) return '🍃';
  if (haystack.includes('community') || haystack.includes('support'))
    return '👥';
  return '📍';
}

/**
 * Reference-aligned feed: thumbnail rows for updates, image cards with date
 * badges for events, icon rows for services, divider rows as fallback.
 */
export function CardFeed(props: Props) {
  const variant = props.variant ?? 'default';
  if (props.cards.length === 0 && props.emptyLabel) {
    return (
      <view className="card-list">
        <text className="empty-copy">{props.emptyLabel}</text>
      </view>
    );
  }

  if (variant === 'updates') {
    return (
      <view className="card-list">
        {props.cards.map((card) => (
          <view
            className="thumb-row"
            key={card.slug}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${card.title}. ${card.meta}`}
            bindtap={() => props.onSelect(card.slug)}
          >
            <image
              className="thumb"
              src={woodbrookImage}
              mode="aspectFill"
              accessibility-element={false}
            />
            <view className="thumb-copy">
              <text className="card-meta card-meta-uppercase">{card.meta}</text>
              <text className="thumb-title">{card.title}</text>
              <text className="thumb-summary">{card.summary}</text>
            </view>
            <view className="chevron-circle">
              <text className="chevron-text">›</text>
            </view>
          </view>
        ))}
      </view>
    );
  }

  if (variant === 'events') {
    return (
      <view className="card-list">
        {props.cards.map((card) => {
          const badge = eventDateBadge(card.meta);
          return (
            <view
              className="event-card"
              key={card.slug}
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label={`${card.title}. ${card.summary}`}
              bindtap={() => props.onSelect(card.slug)}
            >
              <view className="event-image-wrap">
                <image
                  className="event-image"
                  src={woodbrookImage}
                  mode="aspectFill"
                  accessibility-element={false}
                />
                <view className="date-badge">
                  <text className="date-day">{badge.day}</text>
                  <text className="date-month">{badge.month}</text>
                </view>
              </view>
              <view className="event-body">
                <view className="event-copy">
                  <text className="event-title">{card.title}</text>
                  <text className="event-summary">{card.summary}</text>
                  <text className="event-meta">🕒 {card.meta}</text>
                </view>
                <view className="chevron-circle">
                  <text className="chevron-text">›</text>
                </view>
              </view>
            </view>
          );
        })}
      </view>
    );
  }

  if (variant === 'services') {
    return (
      <view className="card-list">
        {props.cards.map((card) => (
          <view
            className="service-row"
            key={card.slug}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${card.title}. ${card.meta}`}
            bindtap={() => props.onSelect(card.slug)}
          >
            <view className="service-icon">
              <text className="service-icon-text">
                {serviceIconFor(card.title, card.meta)}
              </text>
            </view>
            <view className="service-copy">
              <text className="service-title">{card.title}</text>
              <text className="service-subtitle">{card.summary}</text>
            </view>
            <view className="chevron-circle">
              <text className="chevron-text">›</text>
            </view>
          </view>
        ))}
      </view>
    );
  }

  return (
    <view className="card-list">
      {props.cards.map((card, index) =>
        index === 0 ? (
          <view
            className="featured-card"
            key={card.slug}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${card.title}. ${card.summary}`}
            bindtap={() => props.onSelect(card.slug)}
          >
            <text className="card-meta">{card.meta}</text>
            <text className="featured-title">{card.title}</text>
            <text className="card-copy">{card.summary}</text>
            <text className="card-action">{props.actionLabel}</text>
          </view>
        ) : (
          <view
            className="list-row"
            key={card.slug}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${card.title}. ${card.meta}`}
            bindtap={() => props.onSelect(card.slug)}
          >
            <view className="list-row-copy">
              <text className="list-row-title">{card.title}</text>
              <text className="card-meta">{card.meta}</text>
            </view>
            <text className="list-row-arrow">→</text>
          </view>
        ),
      )}
    </view>
  );
}
