import { Link } from '@tanstack/react-router';
import { ArrowRight, Phone } from 'lucide-react';

import { formatLabel } from '../content/contentFormatting';
import type { Resource } from '../content/contentTypes';
import { ResourceDetailValue } from './ResourceDetailValue';
import { toTelephoneHref } from './resourceDirectory';

export function LocalServiceCard(props: { resource: Resource }) {
  const cardDetails = props.resource.details.filter(
    (detail) => detail.showOnCard,
  );

  return (
    <article className="resource-card">
      <div className="resource-card-heading">
        <span className="eyebrow">{formatLabel(props.resource.category)}</span>
        {props.resource.outOfHours ? (
          <span className="availability-badge">Out-of-hours contact</span>
        ) : null}
      </div>
      <p className="resource-type">{props.resource.serviceType}</p>
      <h2>
        <Link
          className="card-stretched-link"
          to="/local-info/$slug"
          params={{ slug: props.resource.slug }}
        >
          {props.resource.title}
        </Link>
      </h2>
      <p>{props.resource.description}</p>

      {cardDetails.length > 0 ? (
        <dl className="resource-details">
          {cardDetails.map((detail) => (
            <div key={detail.id}>
              <dt>{detail.label}</dt>
              <dd>
                <ResourceDetailValue detail={detail} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="resource-actions">
        {props.resource.phone ? (
          <a
            className="button card-secondary-link"
            href={toTelephoneHref(props.resource.phone)}
          >
            <Phone size={16} aria-hidden="true" /> Call {props.resource.phone}
          </a>
        ) : null}
        <Link
          className="button button-secondary card-secondary-link"
          to="/local-info/$slug"
          params={{ slug: props.resource.slug }}
          aria-label={`View details: ${props.resource.title}`}
        >
          View details <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
