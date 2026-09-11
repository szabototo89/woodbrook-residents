import { Link } from '@tanstack/react-router';
import { ArrowRight, MapPin } from 'lucide-react';

import { formatDate } from '../content/contentFormatting';
import type { Resource } from '../content/contentTypes';
import { getLocalHighlights } from './localHighlightModel';

export function LocalHighlights({
  resources,
  today,
}: {
  resources: Resource[];
  today: string;
}) {
  const highlights = getLocalHighlights(resources, today);

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section
      className="local-highlights"
      aria-labelledby="local-highlights-heading"
    >
      <h2 id="local-highlights-heading">Good to know locally</h2>
      <div className="local-highlight-list">
        {highlights.map(({ resource, summary, facts, note, actionLabel }) => (
          <article className="local-highlight" key={resource.documentId}>
            <span className="local-highlight-icon" aria-hidden="true">
              <MapPin size={21} />
            </span>
            <div className="local-highlight-content">
              <p className="resource-type">{resource.serviceType}</p>
              <h3>{resource.title}</h3>
              {summary ? (
                <p className="local-highlight-summary">{summary}</p>
              ) : null}
              {facts.length > 0 ? (
                <dl className="local-highlight-facts">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>
                        {fact.dateTime ? (
                          <time dateTime={fact.dateTime}>
                            {formatDate(fact.value)}
                          </time>
                        ) : (
                          fact.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {note ? (
                <p className="local-highlight-note">
                  <strong>Applies to:</strong> {note}
                </p>
              ) : null}
            </div>
            <Link
              className="text-link local-highlight-action"
              to="/local-info/$slug"
              params={{ slug: resource.slug }}
              aria-label={`${actionLabel}: ${resource.title}`}
            >
              {actionLabel} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
