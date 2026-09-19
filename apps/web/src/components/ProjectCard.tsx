import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Project } from '../features/content/contentTypes';

export function ProjectCard(props: { project: Project }) {
  return (
    <article className="content-card project-card">
      {props.project.imagePath ? (
        <img
          src={props.project.imagePath}
          alt={props.project.imageAlt ?? ''}
          loading="lazy"
        />
      ) : null}
      <div className="card-body">
        <div className="card-meta">
          <span className={`tag status-${props.project.stage}`}>
            {formatLabel(props.project.stage)}
          </span>
          <span>{formatLabel(props.project.category)}</span>
        </div>
        <h3>
          <Link
            className="card-stretched-link"
            to="/projects/$slug"
            params={{ slug: props.project.slug }}
          >
            {props.project.title}
          </Link>
        </h3>
        <p>{props.project.summary}</p>
        {props.project.nextStep ? (
          <p className="next-step">
            <strong>Next:</strong> {props.project.nextStep}
          </p>
        ) : null}
        <Link
          className="text-link card-secondary-link"
          to="/projects/$slug"
          params={{ slug: props.project.slug }}
          aria-label={`View project: ${props.project.title}`}
        >
          View project <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <small>Reviewed {formatDate(props.project.sourceReviewedOn)}</small>
      </div>
    </article>
  );
}
