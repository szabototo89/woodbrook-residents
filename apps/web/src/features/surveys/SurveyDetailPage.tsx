import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react';

import { formatDate, formatLabel } from '../content/contentFormatting';
import { Route } from '../../routes/surveys/$slug';

export function SurveyDetailPage() {
  const survey = Route.useLoaderData();

  if (!survey) {
    return (
      <main id="main-content" className="section shell narrow">
        <p className="eyebrow">Consultation unavailable</p>
        <h1>We couldn’t find that consultation</h1>
        <p>
          It may have been unpublished, or the content service may be offline.
        </p>
        <Link className="text-link" to="/surveys">
          <ArrowLeft size={16} aria-hidden="true" /> Back to consultations
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content">
      <article className="article-page">
        <header className="article-header shell narrow">
          <Link className="back-link" to="/surveys">
            <ArrowLeft size={15} aria-hidden="true" /> All consultations
          </Link>
          <div className="card-meta">
            <span className={`tag status-${survey.stage}`}>
              {formatLabel(survey.stage)}
            </span>
            {survey.closesOn ? (
              <span>
                <CalendarDays size={14} aria-hidden="true" />
                {survey.stage === 'closed' ? 'Closed' : 'Closes'}{' '}
                {formatDate(survey.closesOn)}
              </span>
            ) : null}
          </div>
          <h1>{survey.title}</h1>
          <p className="article-deck">{survey.summary}</p>
        </header>
        <div className="article-body shell narrow">
          {survey.opensOn || survey.closesOn ? (
            <dl className="detail-facts detail-facts-two">
              {survey.opensOn ? (
                <div>
                  <dt>Opens</dt>
                  <dd>{formatDate(survey.opensOn)}</dd>
                </div>
              ) : null}
              {survey.closesOn ? (
                <div>
                  <dt>Closes</dt>
                  <dd>{formatDate(survey.closesOn)}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          {survey.responseUrl && survey.stage !== 'closed' ? (
            <a
              className="button button-primary detail-action"
              href={survey.responseUrl}
              target="_blank"
              rel="noreferrer"
            >
              {survey.stage === 'open' ? 'Have your say' : 'View consultation'}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ) : null}
          <aside className="source-note">
            <p className="eyebrow">Source and freshness</p>
            <p>
              This consultation summary was checked against {survey.sourceName}{' '}
              on {formatDate(survey.sourceReviewedOn)}.
            </p>
            <a
              className="text-link"
              href={survey.sourceUrl}
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
