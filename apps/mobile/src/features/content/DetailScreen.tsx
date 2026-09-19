import woodbrookImage from '../../../../web/public/images/woodbrook-coast-aerial-768.jpg';

import { ExternalLink } from '../../components/ExternalLink.js';
import type { CollectionKey, DetailModel, Route } from './contentModels.js';
import { domainOf, openExternalUrl, type OpenUrl } from './externalUrl.js';

type Props = {
  collection: CollectionKey;
  model?: DetailModel;
  goBack: (fallback: Route) => void;
  onOpenUrl?: OpenUrl;
};

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function factIconFor(label: string): string {
  const normalized = label.toLowerCase();
  if (normalized.includes('open') || normalized.includes('close')) return '📅';
  if (normalized.includes('location') || normalized.includes('address'))
    return '📍';
  if (normalized.includes('start') || normalized.includes('end')) return '🕒';
  return 'ℹ️';
}

export function DetailScreen(props: Props) {
  const onOpenUrl = props.onOpenUrl ?? openExternalUrl;
  const collectionRoute: Route = {
    name: 'collection',
    collection: props.collection,
  };
  if (!props.model) {
    return (
      <view className="status-screen">
        <text className="status-title">This item is unavailable.</text>
        <text className="status-copy">
          It may have been removed or the link is out of date. Try the
          collection instead.
        </text>
        <text className="button" bindtap={() => props.goBack(collectionRoute)}>
          Back
        </text>
      </view>
    );
  }
  const contact = props.model.contact;
  const hasContact = Boolean(contact?.phone ?? contact?.email ?? contact?.url);
  const addressFact = props.model.facts.find((fact) =>
    /address/i.test(fact.label),
  );
  const eventLocationFact =
    props.collection === 'events'
      ? props.model.facts.find((fact) => fact.label === 'Location')
      : undefined;
  const hasActions = hasContact || addressFact || eventLocationFact;
  const showHero =
    props.collection === 'surveys' || props.collection === 'events';
  const statusPill =
    props.model.eyebrow.split('·')[0]?.trim() ?? props.model.eyebrow;
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <text
        className="back-link"
        accessibility-element={true}
        accessibility-trait="button"
        accessibility-label={props.model.backLabel}
        bindtap={() => props.goBack(collectionRoute)}
      >
        ← {props.model.backLabel}
      </text>
      <view className="page-intro page-intro-detail">
        <view className="status-pill">
          <text className="status-pill-text">{statusPill}</text>
        </view>
        <text className="eyebrow">{props.model.eyebrow}</text>
        <text className="page-title">{props.model.title}</text>
        <text className="page-copy">{props.model.summary}</text>
      </view>
      {showHero ? (
        <view className="detail-hero-wrap">
          <image
            className="detail-hero"
            src={woodbrookImage}
            mode="aspectFill"
            accessibility-element={false}
          />
        </view>
      ) : null}
      <view className="detail-body">
        {props.model.facts.map((fact) => (
          <view className="fact-row" key={`${fact.label}-${fact.value}`}>
            <view className="fact-icon">
              <text className="fact-icon-text">{factIconFor(fact.label)}</text>
            </view>
            <view className="fact-copy">
              <text className="fact-label">{fact.label}</text>
              <text className="fact-value">{fact.value}</text>
            </view>
          </view>
        ))}
        {props.model.paragraphs.map((paragraph) => (
          <text className="body-copy" key={paragraph}>
            {paragraph}
          </text>
        ))}
        {hasActions ? (
          <view className="contact-group">
            <text className="fact-label">Contact</text>
            {contact?.phone ? (
              <ExternalLink
                url={`tel:${contact.phone}`}
                label={`Call ${contact.phone}`}
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
            {contact?.email ? (
              <ExternalLink
                url={`mailto:${contact.email}`}
                label={`Email ${contact.email}`}
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
            {contact?.url ? (
              <ExternalLink
                url={contact.url}
                label={`Visit ${domainOf(contact.url)} ↗`}
                detail={contact.url}
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                detailClassName="source-link-detail"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
            {addressFact ? (
              <ExternalLink
                url={mapsUrl(addressFact.value)}
                label="Get directions ↗"
                detail={addressFact.value}
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                detailClassName="source-link-detail"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
            {eventLocationFact && !addressFact ? (
              <ExternalLink
                url={mapsUrl(eventLocationFact.value)}
                label="Get directions ↗"
                detail="Open in Maps"
                containerClassName="contact-link"
                labelClassName="contact-link-label"
                detailClassName="source-link-detail"
                onOpenUrl={onOpenUrl}
              />
            ) : null}
          </view>
        ) : null}
        {props.model.action ? (
          <ExternalLink
            url={props.model.action.url}
            label={props.model.action.label}
            detail={domainOf(props.model.action.url)}
            containerClassName="primary-action"
            labelClassName="primary-action-label"
            detailClassName="primary-action-url"
            onOpenUrl={onOpenUrl}
          />
        ) : null}
        <view className="source-note">
          <text className="fact-label">Official source</text>
          <text className="source-name">{props.model.sourceName}</text>
          <ExternalLink
            url={props.model.sourceUrl}
            label={`${domainOf(props.model.sourceUrl)} ↗`}
            detail={`Checked ${props.model.reviewedOn}`}
            containerClassName="source-link"
            labelClassName="source-link-label"
            detailClassName="source-link-detail"
            onOpenUrl={onOpenUrl}
          />
        </view>
      </view>
      <view className="scroll-spacer" />
    </scroll-view>
  );
}
