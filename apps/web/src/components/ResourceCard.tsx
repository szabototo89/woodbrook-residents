import { ArrowUpRight, Mail, Phone } from 'lucide-react';

import { formatLabel } from '../features/content/contentFormatting';
import type { Resource } from '../features/content/contentTypes';

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card">
      <span className="eyebrow">{formatLabel(resource.category)}</span>
      <h2>{resource.title}</h2>
      <p>{resource.description}</p>
      <div className="resource-actions">
        {resource.url ? (
          <a
            className="text-link"
            href={resource.url}
            target="_blank"
            rel="noreferrer"
          >
            Visit website <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : null}
        {resource.phone ? (
          <a href={`tel:${resource.phone.replaceAll(' ', '')}`}>
            <Phone size={15} aria-hidden="true" /> {resource.phone}
          </a>
        ) : null}
        {resource.email ? (
          <a href={`mailto:${resource.email}`}>
            <Mail size={15} aria-hidden="true" /> {resource.email}
          </a>
        ) : null}
      </div>
    </article>
  );
}
