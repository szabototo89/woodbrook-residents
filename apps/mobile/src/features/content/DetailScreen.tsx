import { ExternalLink } from '../../components/ExternalLink.js';
import type { CollectionKey, DetailModel, Route } from './contentModels.js';
import { domainOf, openExternalUrl, type OpenUrl } from './externalUrl.js';

type Props = {
  collection: CollectionKey;
  model?: DetailModel;
  navigate: (route: Route) => void;
  onOpenUrl?: OpenUrl;
};

export function DetailScreen({
  collection,
  model,
  navigate,
  onOpenUrl = openExternalUrl,
}: Props) {
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
  const contact = model.contact;
  const hasContact = Boolean(contact?.phone ?? contact?.email ?? contact?.url);
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
        {hasContact ? (
          <view className="contact-group">
            <text className="fact-label">Contact</text>
            {contact?.phone ? (
              <ExternalLink
                url={`tel:${contact.phone}`}
                label={contact.phone}
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
            {contact?.email ? (
              <ExternalLink
                url={`mailto:${contact.email}`}
                label={contact.email}
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
            {contact?.url ? (
              <ExternalLink
                url={contact.url}
                label={domainOf(contact.url)}
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
          </view>
        ) : null}
        {model.action ? (
          <ExternalLink
            url={model.action.url}
            label={model.action.label}
            detail={domainOf(model.action.url)}
            containerClassName="primary-action"
            labelClassName="primary-action-label"
            detailClassName="primary-action-url"
            onOpenUrl={onOpenUrl}
          />
        ) : null}
        <view className="source-note">
          <text className="fact-label">Official source</text>
          <text className="source-name">{model.sourceName}</text>
          <ExternalLink
            url={model.sourceUrl}
            label={domainOf(model.sourceUrl)}
            detail={`Verified ${model.reviewedOn}`}
            containerClassName="source-link"
            labelClassName="source-link-label"
            detailClassName="source-link-detail"
            onOpenUrl={onOpenUrl}
          />
        </view>
      </view>
    </scroll-view>
  );
}
