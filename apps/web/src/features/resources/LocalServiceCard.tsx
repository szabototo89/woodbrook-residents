import { ArrowUpRight, Mail, Phone, ShieldCheck } from 'lucide-react';

import { formatDate, formatLabel } from '../content/contentFormatting';
import type { Resource } from '../content/contentTypes';

function toTelephoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

export function LocalServiceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card">
      <div className="resource-card-heading">
        <span className="eyebrow">{formatLabel(resource.category)}</span>
        {resource.outOfHours ? (
          <span className="availability-badge">Out-of-hours contact</span>
        ) : null}
      </div>
      <p className="resource-type">{resource.serviceType}</p>
      <h2>{resource.title}</h2>
      <p>{resource.description}</p>

      {resource.details.length > 0 ? (
        <dl className="resource-details">
          {resource.details.map((detail) => (
            <div key={detail.id}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="resource-actions">
        {resource.phone ? (
          <a className="button" href={toTelephoneHref(resource.phone)}>
            <Phone size={16} aria-hidden="true" /> Call {resource.phone}
          </a>
        ) : null}
        {resource.url ? (
          <a
            className="button button-secondary"
            href={resource.url}
            target="_blank"
            rel="noreferrer"
          >
            Website <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
        {resource.email ? (
          <a className="resource-email" href={`mailto:${resource.email}`}>
            <Mail size={15} aria-hidden="true" /> Email
          </a>
        ) : null}
      </div>

      <div className="resource-source">
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          Checked {formatDate(resource.sourceReviewedOn)} against{' '}
          <a href={resource.sourceUrl} target="_blank" rel="noreferrer">
            {resource.sourceName}
          </a>
        </span>
      </div>
    </article>
  );
}
