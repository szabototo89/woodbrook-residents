import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  MapPinned,
  MessageSquareText,
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

  return (
    <main id="main-content">
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <MapPinned size={14} aria-hidden="true" />
              Woodbrook Community Hub · Shankill
            </p>
            <h1>
              What’s happening here. <span>What we can do together.</span>
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
              <Link className="button" to="/updates">
                See what’s happening <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" to="/surveys">
                Have your say
              </Link>
            </div>
            <dl className="fact-row" aria-label="Community hub information">
              <div>
                <dt>{content.updates.length}</dt>
                <dd>local updates</dd>
              </div>
              <div>
                <dt>{content.projects.length}</dt>
                <dd>projects tracked</dd>
              </div>
              <div>
                <dt>Verified</dt>
                <dd>source-linked facts</dd>
              </div>
            </dl>
          </div>
          <aside className="hero-board" aria-label="Community board">
            <div className="board-heading">
              <span>On the community board</span>
              <small>Woodbrook · right now</small>
            </div>
            <div className="board-feature">
              <p className="eyebrow">Built for residents</p>
              <h2>Find out. Join in. Help shape Woodbrook.</h2>
              <p>
                Follow local changes, check useful dates, respond to
                consultations, and turn a neighbourhood concern into a clear
                next step.
              </p>
            </div>
            <div className="board-links">
              <Link to="/updates">
                <span>Stay informed</span>
                <strong>{content.updates.length} verified local updates</strong>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/events">
                <span>Meet and join in</span>
                <strong>
                  {content.events.length}{' '}
                  {content.events.length === 1
                    ? 'upcoming date'
                    : 'upcoming dates'}
                </strong>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/projects">
                <span>Shape the area</span>
                <strong>
                  {content.projects.length} projects being tracked
                </strong>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/report">
                <span>Raise a concern</span>
                <strong>Send a private issue report</strong>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="action-rail" aria-label="Community hub priorities">
        <div className="shell action-rail-grid">
          <Link to="/updates">
            <span className="action-stop">
              <MessageSquareText size={20} aria-hidden="true" />
            </span>
            <strong>Know what’s happening</strong>
            <small>Updates and useful local information</small>
          </Link>
          <Link to="/projects">
            <span className="action-stop">
              <Users size={20} aria-hidden="true" />
            </span>
            <strong>Take part</strong>
            <small>Projects, events, and consultations</small>
          </Link>
          <Link to="/report">
            <span className="action-stop">
              <CircleAlert size={20} aria-hidden="true" />
            </span>
            <strong>Help improve the area</strong>
            <small>Report an issue or get involved</small>
          </Link>
        </div>
      </section>

      {content.availability === 'unavailable' ? (
        <section className="section shell">
          <CmsUnavailable />
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
            <p className="eyebrow">From signal to action</p>
            <h2>A local observation can become a shared next step.</h2>
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
