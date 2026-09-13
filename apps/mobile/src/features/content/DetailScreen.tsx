import type { CollectionKey, DetailModel, Route } from './contentModels.js';

type Props = {
  collection: CollectionKey;
  model?: DetailModel;
  navigate: (route: Route) => void;
};

export function DetailScreen({ collection, model, navigate }: Props) {
  if (!model) {
    return (
      <view className="status-screen">
        <text className="page-title">This item is unavailable.</text>
        <text
          className="button"
          bindtap={() => navigate({ name: 'collection', collection })}
        >
          Back
        </text>
      </view>
    );
  }
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <text
        className="back-link"
        bindtap={() => navigate({ name: 'collection', collection })}
      >
        {model.backLabel}
      </text>
      <view className="page-intro">
        <text className="eyebrow">{model.eyebrow}</text>
        <text className="page-title">{model.title}</text>
        <text className="page-copy">{model.summary}</text>
      </view>
      <view className="detail-body">
        {model.facts.map((fact) => (
          <view className="fact" key={`${fact.label}-${fact.value}`}>
            <text className="fact-label">{fact.label}</text>
            <text className="fact-value">{fact.value}</text>
          </view>
        ))}
        {model.paragraphs.map((paragraph) => (
          <text className="body-copy" key={paragraph}>
            {paragraph}
          </text>
        ))}
        {model.action ? (
          <view className="primary-action">
            <text className="primary-action-label">{model.action.label}</text>
            <text className="primary-action-url">{model.action.url}</text>
          </view>
        ) : null}
        <view className="source-note">
          <text className="fact-label">Official source</text>
          <text className="source-name">{model.sourceName}</text>
          <text className="source-url">{model.sourceUrl}</text>
          <text className="source-review">Checked {model.reviewedOn}</text>
        </view>
      </view>
    </scroll-view>
  );
}
