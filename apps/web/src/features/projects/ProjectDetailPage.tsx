import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react';

import { formatDate, formatLabel } from '../content/contentFormatting';
import { Route } from '../../routes/projects/$slug';

export function ProjectDetailPage() {
  const project = Route.useLoaderData();

  if (!project) {
    return (
      <main id="main-content" className="section shell narrow">
        <p className="eyebrow">Project unavailable</p>
        <h1>We couldn’t find that project</h1>
        <p>
          It may have been unpublished, or the content service may be offline.
        </p>
        <Link className="text-link" to="/projects">
          <ArrowLeft size={16} aria-hidden="true" /> Back to projects
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content">
      <article className="article-page">
        <header className="article-header shell narrow">
          <Link className="back-link" to="/projects">
            <ArrowLeft size={15} aria-hidden="true" /> All projects
          </Link>
          <div className="card-meta">
            <span className={`tag status-${project.stage}`}>
              {formatLabel(project.stage)}
            </span>
            <span>{formatLabel(project.category)}</span>
            <span>
              <CalendarDays size={14} aria-hidden="true" />
              Updated {formatDate(project.updatedOn)}
            </span>
          </div>
          <h1>{project.title}</h1>
          <p className="article-deck">{project.summary}</p>
        </header>
        {project.imagePath ? (
          <figure className="article-image shell">
            <img src={project.imagePath} alt={project.imageAlt ?? ''} />
            {project.imageCredit && project.imageCreditUrl ? (
              <figcaption>
                Photo:{' '}
                <a
                  href={project.imageCreditUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.imageCredit}
                </a>
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <div className="article-body shell narrow">
          {project.details.split('\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {project.nextStep ? (
            <aside className="detail-callout">
              <p className="eyebrow">What happens next</p>
              <p>{project.nextStep}</p>
            </aside>
          ) : null}
          <aside className="source-note">
            <p className="eyebrow">Source and freshness</p>
            <p>
              This project summary was checked against {project.sourceName} on{' '}
              {formatDate(project.sourceReviewedOn)}.
            </p>
            <a
              className="text-link"
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Read the official source{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </article>
    </main>
  );
}
