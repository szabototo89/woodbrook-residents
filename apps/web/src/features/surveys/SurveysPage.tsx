import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SurveyCard } from '../../components/SurveyCard';
import { Route } from '../../routes/surveys/index';

export function SurveysPage() {
  const content = Route.useLoaderData();

  return (
    <main id="main-content">
      <PageIntro eyebrow="Have your say" title="Consultations">
        <p>
          Open opportunities to respond, plus a record of relevant closed
          consultations so important context does not disappear.
        </p>
      </PageIntro>
      <section className="section shell">
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        {content.availability === 'ready' && content.items.length === 0 ? (
          <EmptyState
            title="No consultations published"
            message="There are no verified surveys or consultations to show."
          />
        ) : null}
        <div className="card-grid card-grid-two">
          {content.items.map((survey) => (
            <SurveyCard key={survey.documentId} survey={survey} />
          ))}
        </div>
      </section>
    </main>
  );
}
