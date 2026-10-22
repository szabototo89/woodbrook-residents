import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { formatLabel } from '../content/contentFormatting';
import type { Project } from '../content/contentTypes';

export function HomeProjectRow(props: { project: Project }) {
  return (
    <article className="home-project-row">
      {props.project.imagePath ? (
        <img
          src={props.project.imagePath}
          alt={props.project.imageAlt ?? ''}
          width="60"
          height="82"
          loading="lazy"
        />
      ) : null}
      <div>
        <div className="home-row-meta">
          <span className="home-project-category">
            {formatLabel(props.project.category)}
          </span>
          <span className={`tag status-${props.project.stage}`}>
            {formatLabel(props.project.stage)}
          </span>
        </div>
        <h3>
          <Link to="/projects/$slug" params={{ slug: props.project.slug }}>
            {props.project.title}
          </Link>
        </h3>
        <p>{props.project.summary}</p>
      </div>
      <ChevronRight size={17} aria-hidden="true" />
    </article>
  );
}
