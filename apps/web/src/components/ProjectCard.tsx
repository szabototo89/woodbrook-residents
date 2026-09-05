import { ArrowUpRight } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Project } from '../features/content/contentTypes';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="content-card project-card">
      {project.imagePath ? (
        <img
          src={project.imagePath}
          alt={project.imageAlt ?? ''}
          loading="lazy"
        />
      ) : null}
      <div className="card-body">
        <div className="card-meta">
          <span className={`tag status-${project.stage}`}>
            {formatLabel(project.stage)}
          </span>
          <span>{formatLabel(project.category)}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.nextStep ? (
          <p className="next-step">
            <strong>Next:</strong> {project.nextStep}
          </p>
        ) : null}
        <a
          className="text-link"
          href={project.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Official source <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <small>Reviewed {formatDate(project.sourceReviewedOn)}</small>
      </div>
    </article>
  );
}
