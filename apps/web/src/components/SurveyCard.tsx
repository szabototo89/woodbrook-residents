import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Survey } from '../features/content/contentTypes';

export function SurveyCard(props: { survey: Survey }) {
  return (
    <article className="survey-card">
      <span className={`tag status-${props.survey.stage}`}>
        {formatLabel(props.survey.stage)}
      </span>
      <h2>
        <Link
          className="card-stretched-link"
          to="/surveys/$slug"
          params={{ slug: props.survey.slug }}
        >
          {props.survey.title}
        </Link>
      </h2>
      <p>{props.survey.summary}</p>
      {props.survey.closesOn ? (
        <p className="survey-date">
          {props.survey.stage === 'closed' ? 'Closed' : 'Closes'}{' '}
          {formatDate(props.survey.closesOn)}
        </p>
      ) : null}
      <Link
        className="text-link card-secondary-link"
        to="/surveys/$slug"
        params={{ slug: props.survey.slug }}
        aria-label={`View details: ${props.survey.title}`}
      >
        View details <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  );
}
