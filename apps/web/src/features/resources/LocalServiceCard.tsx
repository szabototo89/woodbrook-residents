import { Link } from '@tanstack/react-router';
import { ArrowRight, Phone } from 'lucide-react';

import { formatLabel } from '../content/contentFormatting';
import type { Resource } from '../content/contentTypes';
import { toTelephoneHref } from './resourceDirectory';

export function LocalServiceCard({ resource }: { resource: Resource }) {
  const cardDetails = resource.details.filter((detail) => detail.showOnCard);

  return (
    <article className="resource-card">
      <div className="resource-card-heading">
        <span className="eyebrow">{formatLabel(resource.category)}</span>
        {resource.outOfHours ? (
          <span className="availability-badge">Out-of-hours contact</span>
        ) : null}
      </div>
      <p className="resource-type">{resource.serviceType}</p>
      <h2>
        <Link to="/local-info/$slug" params={{ slug: resource.slug }}>
          {resource.title}
        </Link>
      </h2>
      <p>{resource.description}</p>

      {cardDetails.length > 0 ? (
        <dl className="resource-details">
          {cardDetails.map((detail) => (
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
        <Link
          className="button button-secondary"
          to="/local-info/$slug"
          params={{ slug: resource.slug }}
          aria-label={`View details: ${resource.title}`}
        >
          View details <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
