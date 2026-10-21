import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react';
import Markdown from 'react-markdown';

import { formatDate, formatLabel } from '../content/contentFormatting';
import { Route } from '../../routes/updates/$slug';
import './update-markdown.css';

export function UpdateDetailPage() {
  const update = Route.useLoaderData();

  if (!update) {
    return (
      <main id="main-content" className="section shell narrow">
        <p className="eyebrow">News unavailable</p>
        <h1>We couldn’t find that news article</h1>
        <p>
          It may have been unpublished, or the content service may be offline.
        </p>
        <Link className="text-link" to="/updates">
          <ArrowLeft size={16} aria-hidden="true" /> Back to news
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content">
      <article className="article-page">
        <header className="article-header shell narrow">
          <Link className="back-link" to="/updates">
            <ArrowLeft size={15} aria-hidden="true" /> All news
          </Link>
          <div className="card-meta">
            <span className="tag">{formatLabel(update.kind)}</span>
            <span>
              <CalendarDays size={14} aria-hidden="true" />
              {formatDate(update.publishedOn)}
            </span>
          </div>
          <h1>{update.title}</h1>
          <p className="article-deck">{update.summary}</p>
        </header>
        {update.imagePath ? (
          <figure className="article-image shell">
            <img src={update.imagePath} alt={update.imageAlt ?? ''} />
            {update.imageCredit && update.imageCreditUrl ? (
              <figcaption>
                Photo:{' '}
                <a
                  href={update.imageCreditUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {update.imageCredit}
                </a>
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <div className="article-body shell narrow">
          <div className="update-markdown">
            <Markdown skipHtml>{update.body}</Markdown>
          </div>
          <aside className="source-note">
            <p className="eyebrow">Source and freshness</p>
            <p>
              This summary was checked against {update.sourceName} on{' '}
              {formatDate(update.sourceReviewedOn)}.
            </p>
            <a
              className="text-link"
              href={update.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Read the original source{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </article>
    </main>
  );
}
