import type { CollectionKey, CollectionModel, Route } from './contentModels.js';

type Props = {
  collection: CollectionKey;
  model: CollectionModel;
  navigate: (route: Route) => void;
};

export function CollectionScreen({ collection, model, navigate }: Props) {
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="eyebrow">{model.eyebrow}</text>
        <text className="page-title">{model.title}</text>
        <text className="page-copy">{model.intro}</text>
      </view>
      <view className="card-list">
        {model.cards.length === 0 ? (
          <text className="empty-copy">{model.empty}</text>
        ) : null}
        {model.cards.map((card) => (
          <view
            className="content-card"
            key={card.slug}
            accessibility-element={true}
            accessibility-trait="button"
            bindtap={() =>
              navigate({ name: 'detail', collection, slug: card.slug })
            }
          >
            <text className="card-meta">{card.meta}</text>
            <text className="card-title">{card.title}</text>
            <text className="card-copy">{card.summary}</text>
            <text className="card-action">Read more →</text>
          </view>
        ))}
      </view>
    </scroll-view>
  );
}
