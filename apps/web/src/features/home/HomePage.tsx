import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  MapPinned,
  MessageSquareText,
  TrainFront,
  Users,
} from 'lucide-react';

import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EventCard } from '../../components/EventCard';
import { ProjectCard } from '../../components/ProjectCard';
import { SectionHeading } from '../../components/SectionHeading';
import { SurveyCard } from '../../components/SurveyCard';
import { UpdateCard } from '../../components/UpdateCard';
import { Route } from '../../routes/index';

export function HomePage() {
  const content = Route.useLoaderData();
  const featuredUpdate =
    content.updates.find((update) => update.featured) ?? content.updates[0];

  return (
    <main id="main-content">
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <MapPinned size={14} aria-hidden="true" />
              Woodbrook · Shankill · Dublin 18
            </p>
            <h1>
              Our Woodbrook, <em>together.</em>
            </h1>
            <p className="hero-lede">
              {content.siteSetting?.tagline ??
                'See what’s happening. Have your say. Help shape our neighbourhood.'}
            </p>
            <p className="hero-intro">
              {content.siteSetting?.introduction ??
                'A practical home for local information and resident action.'}
            </p>
            <div className="button-row">
              <Link className="button" to="/get-involved">
                Get involved <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" to="/projects">
                Explore projects
              </Link>
            </div>
            <dl className="fact-row" aria-label="Woodbrook transport facts">
              <div>
                <dt>32nd</dt>
                <dd>DART station</dd>
              </div>
              <div>
                <dt>191</dt>
                <dd>weekday services</dd>
              </div>
              <div>
                <dt>≈40 min</dt>
                <dd>to city centre</dd>
              </div>
            </dl>
          </div>
          <div className="hero-media">
            <figure className="hero-image hero-image-main">
              <img
                src="/images/woodbrook-station.jpg"
                alt="Woodbrook DART station in Shankill"
              />
            </figure>
            <figure className="hero-image hero-image-small">
              <img
                src="/images/shankill-coast.jpg"
                alt="View over Shankill Beach towards Bray"
              />
            </figure>
            <figure className="hero-image hero-image-small">
              <img
                src="/images/shankill-village.jpg"
                alt="Shankill village main street"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="action-rail" aria-label="Community hub priorities">
        <div className="shell action-rail-grid">
          <Link to="/updates">
            <span>
              <MessageSquareText size={20} aria-hidden="true" />
            </span>
            <strong>Inform</strong>
            <small>Reliable local updates</small>
          </Link>
          <Link to="/projects">
            <span>
              <Users size={20} aria-hidden="true" />
            </span>
            <strong>Organise</strong>
            <small>Projects and next steps</small>
          </Link>
          <Link to="/report">
            <span>
              <CircleAlert size={20} aria-hidden="true" />
            </span>
            <strong>Act</strong>
            <small>Report, respond, volunteer</small>
          </Link>
        </div>
      </section>

      {content.availability === 'unavailable' ? (
        <section className="section shell">
          <CmsUnavailable />
        </section>
      ) : null}

      {featuredUpdate ? (
        <section className="section shell">
          <article className="featured-story">
            {featuredUpdate.imagePath ? (
              <img
                src={featuredUpdate.imagePath}
                alt={featuredUpdate.imageAlt ?? ''}
              />
            ) : null}
            <div>
              <p className="eyebrow">
                <TrainFront size={14} aria-hidden="true" /> Featured update
              </p>
              <h2>{featuredUpdate.title}</h2>
              <p>{featuredUpdate.summary}</p>
              <Link
                className="button button-secondary"
                to="/updates/$slug"
                params={{ slug: featuredUpdate.slug }}
              >
                Read the update <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </section>
      ) : null}

      {content.updates.length > 0 ? (
        <section className="section section-tint">
          <div className="shell">
            <SectionHeading
              eyebrow="Latest updates"
              title="From around Woodbrook"
              linkLabel="All updates"
              linkTo="/updates"
            />
            <div className="card-grid">
              {content.updates.map((update) => (
                <UpdateCard key={update.documentId} update={update} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {content.projects.length > 0 ? (
        <section className="section shell">
          <SectionHeading
            eyebrow="Neighbourhood watch"
            title="Projects shaping the area"
            linkLabel="View all projects"
            linkTo="/projects"
          />
          <div className="card-grid">
            {content.projects.map((project) => (
              <ProjectCard key={project.documentId} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section action-banner">
        <div className="shell action-banner-grid">
          <div>
            <p className="eyebrow">Make it useful</p>
            <h2>Notice something? Add signal, not noise.</h2>
            <p>
              Structured reports help the community understand patterns and
              route local issues to the right place.
            </p>
          </div>
          <div className="button-row">
            <Link className="button button-light" to="/report">
              Report an issue <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button button-ghost-light" to="/surveys">
              Have your say
            </Link>
          </div>
        </div>
      </section>

      {content.events.length > 0 || content.surveys.length > 0 ? (
        <section className="section section-tint">
          <div className="shell split-section">
            <div>
              <SectionHeading
                eyebrow="Coming up"
                title="Dates for the diary"
                linkLabel="All events"
                linkTo="/events"
              />
              {content.events.slice(0, 1).map((event) => (
                <EventCard key={event.documentId} event={event} />
              ))}
            </div>
            <div>
              <SectionHeading
                eyebrow="Have your say"
                title="Consultations"
                linkLabel="All surveys"
                linkTo="/surveys"
              />
              {content.surveys.slice(0, 1).map((survey) => (
                <SurveyCard key={survey.documentId} survey={survey} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section shell welcome-strip">
        <CalendarDays size={28} aria-hidden="true" />
        <div>
          <p className="eyebrow">A shared calendar starts with one date</p>
          <h2>Organising something for Woodbrook?</h2>
          <p>
            The hub is being prepared for resident-led meetings, clean-ups, and
            family events. Get involved to help shape the publishing process.
          </p>
        </div>
        <Link className="text-link" to="/get-involved">
          Help build the hub <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
