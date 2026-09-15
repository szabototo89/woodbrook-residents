import type { CollectionKey, CollectionModel, Route } from './contentModels.js';
import { CardFeed } from './CardFeed.js';

type Props = {
  collection: CollectionKey;
  model: CollectionModel;
  navigate: (route: Route) => void;
};

export function CollectionScreen({ collection, model, navigate }: Props) {
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="page-title">{model.title}</text>
        <text className="page-copy">{model.intro}</text>
      </view>
      <CardFeed
        cards={model.cards}
        actionLabel="Read more →"
        emptyLabel={model.empty}
        onSelect={(slug) => navigate({ name: 'detail', collection, slug })}
      />
    </scroll-view>
  );
}
