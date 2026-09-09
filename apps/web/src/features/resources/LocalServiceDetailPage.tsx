import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, Mail, Phone } from 'lucide-react';

import { Route } from '../../routes/local-info/$slug';
import { formatDate, formatLabel } from '../content/contentFormatting';
import { CollectionSchedule } from './CollectionSchedule';
import { ResourceDetailValue } from './ResourceDetailValue';
import { toTelephoneHref } from './resourceDirectory';

export function LocalServiceDetailPage() {
  const resource = Route.useLoaderData();

  if (!resource) {
    return (
      <main id="main-content" className="section shell narrow">
        <p className="eyebrow">Service unavailable</p>
        <h1>We couldn’t find that service</h1>
        <p>
          It may have been unpublished, or the content service may be offline.
        </p>
        <Link className="text-link" to="/local-info">
          <ArrowLeft size={16} aria-hidden="true" /> Back to local information
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content">
      <article className="article-page service-detail-page">
        <header className="article-header shell narrow">
          <Link className="back-link" to="/local-info">
            <ArrowLeft size={15} aria-hidden="true" /> All local services
          </Link>
          <div className="card-meta service-detail-tags">
            <span className="tag">{formatLabel(resource.category)}</span>
            <span>{resource.serviceType}</span>
            <span>{formatLabel(resource.providerType)}</span>
            {resource.outOfHours ? <span>Out-of-hours contact</span> : null}
          </div>
          <h1>{resource.title}</h1>
          <p className="article-deck">{resource.description}</p>
        </header>

        <div className="article-body shell narrow">
          <section aria-labelledby="service-contact-heading">
            <p className="eyebrow">Contact</p>
            <h2 id="service-contact-heading">Contact {resource.title}</h2>
            <div className="button-row detail-actions service-contact-actions">
              {resource.phone ? (
                <a className="button" href={toTelephoneHref(resource.phone)}>
                  <Phone size={17} aria-hidden="true" /> Call {resource.phone}
                </a>
              ) : null}
              {resource.email ? (
                <a
                  className="button button-secondary"
                  href={`mailto:${resource.email}`}
                >
                  <Mail size={17} aria-hidden="true" /> Email
                </a>
              ) : null}
              {resource.url ? (
                <a
                  className="button button-secondary"
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit website <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </section>

          {resource.details.length > 0 ? (
            <section
              className="service-detail-section"
              aria-labelledby="service-details-heading"
            >
              <p className="eyebrow">Useful details</p>
              <h2 id="service-details-heading">What to know</h2>
              <dl className="detail-facts service-detail-facts">
                {resource.details.map((detail) => (
                  <div key={detail.id}>
                    <dt>{detail.label}</dt>
                    <dd>
                      <ResourceDetailValue detail={detail} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {resource.collectionDates.length > 0 ? (
            <CollectionSchedule
              collectionDates={resource.collectionDates}
              documentLabel={resource.documentLabel}
              documentUrl={resource.documentUrl}
            />
          ) : null}

          <aside className="source-note">
            <p className="eyebrow">Source and freshness</p>
            <p>
              These details were checked against {resource.sourceName} on{' '}
              {formatDate(resource.sourceReviewedOn)}.
            </p>
            <a
              className="text-link"
              href={resource.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Review the original source{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </aside>

          <p className="service-detail-disclaimer">
            This listing is provided for convenience, not as an endorsement.
            Check availability, qualifications, and costs directly with the
            provider.
          </p>
        </div>
      </article>
    </main>
  );
}
