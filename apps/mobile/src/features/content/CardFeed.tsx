import type { CardModel } from './contentModels.js';

type Props = {
  cards: CardModel[];
  actionLabel: string;
  emptyLabel: string;
  onSelect: (slug: string) => void;
};

/**
 * A scannable mobile feed: one featured card for the first record and
 * lightweight divider rows for the rest.
 */
export function CardFeed({ cards, actionLabel, emptyLabel, onSelect }: Props) {
  return (
    <view className="card-list">
      {cards.length === 0 && emptyLabel ? (
        <text className="empty-copy">{emptyLabel}</text>
      ) : null}
      {cards.map((card, index) =>
        index === 0 ? (
          <view
            className="featured-card"
            key={card.slug}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${card.title}. ${card.summary}`}
            bindtap={() => onSelect(card.slug)}
          >
            <text className="card-meta">{card.meta}</text>
            <text className="featured-title">{card.title}</text>
            <text className="card-copy">{card.summary}</text>
            <text className="card-action">{actionLabel}</text>
          </view>
        ) : (
          <view
            className="list-row"
            key={card.slug}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${card.title}. ${card.meta}`}
            bindtap={() => onSelect(card.slug)}
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
