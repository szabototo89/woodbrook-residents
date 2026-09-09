import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { ProjectCard } from '../../components/ProjectCard';
import { Route } from '../../routes/projects/index';

export function ProjectsPage() {
  const content = Route.useLoaderData();

  return (
    <main id="main-content">
      <PageIntro eyebrow="Follow local change" title="Projects">
        <p>
          A simple record of what is proposed, active, completed, or still being
          monitored — with the latest known next step and an official source.
        </p>
      </PageIntro>
      <section className="section shell">
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        {content.availability === 'ready' && content.items.length === 0 ? (
          <EmptyState
            title="No projects published"
            message="There are no projects in the public tracker yet."
          />
        ) : null}
        <div className="card-grid">
          {content.items.map((project) => (
            <ProjectCard key={project.documentId} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
