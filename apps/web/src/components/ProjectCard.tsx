import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Project } from '../features/content/contentTypes';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="content-card project-card">
      {project.imagePath ? (
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          tabIndex={-1}
        >
          <img
            src={project.imagePath}
            alt={project.imageAlt ?? ''}
            loading="lazy"
          />
        </Link>
      ) : null}
      <div className="card-body">
        <div className="card-meta">
          <span className={`tag status-${project.stage}`}>
            {formatLabel(project.stage)}
          </span>
          <span>{formatLabel(project.category)}</span>
        </div>
        <h3>
          <Link to="/projects/$slug" params={{ slug: project.slug }}>
            {project.title}
          </Link>
        </h3>
        <p>{project.summary}</p>
        {project.nextStep ? (
          <p className="next-step">
            <strong>Next:</strong> {project.nextStep}
          </p>
        ) : null}
        <Link
          className="text-link"
          to="/projects/$slug"
          params={{ slug: project.slug }}
          aria-label={`View project: ${project.title}`}
        >
          View project <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <small>Reviewed {formatDate(project.sourceReviewedOn)}</small>
      </div>
    </article>
  );
}
