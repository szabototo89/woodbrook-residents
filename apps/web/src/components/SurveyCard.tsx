import { ArrowUpRight } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Survey } from '../features/content/contentTypes';

export function SurveyCard({ survey }: { survey: Survey }) {
  return (
    <article className="survey-card">
      <span className={`tag status-${survey.stage}`}>
        {formatLabel(survey.stage)}
      </span>
      <h2>{survey.title}</h2>
      <p>{survey.summary}</p>
      {survey.closesOn ? (
        <p className="survey-date">
          {survey.stage === 'closed' ? 'Closed' : 'Closes'}{' '}
          {formatDate(survey.closesOn)}
        </p>
      ) : null}
      <a
        className="text-link"
        href={survey.responseUrl ?? survey.sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        {survey.stage === 'open' ? 'Have your say' : 'View source'}{' '}
        <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </article>
  );
}
