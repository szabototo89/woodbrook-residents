import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Survey } from '../features/content/contentTypes';

export function SurveyCard({ survey }: { survey: Survey }) {
  return (
    <article className="survey-card">
      <span className={`tag status-${survey.stage}`}>
        {formatLabel(survey.stage)}
      </span>
      <h2>
        <Link to="/surveys/$slug" params={{ slug: survey.slug }}>
          {survey.title}
        </Link>
      </h2>
      <p>{survey.summary}</p>
      {survey.closesOn ? (
        <p className="survey-date">
          {survey.stage === 'closed' ? 'Closed' : 'Closes'}{' '}
          {formatDate(survey.closesOn)}
        </p>
      ) : null}
      <Link
        className="text-link"
        to="/surveys/$slug"
        params={{ slug: survey.slug }}
        aria-label={`View details: ${survey.title}`}
      >
        View details <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  );
}
