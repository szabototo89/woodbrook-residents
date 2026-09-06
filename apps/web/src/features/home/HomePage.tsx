import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  Hammer,
  House,
  Megaphone,
} from 'lucide-react';

import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EventCard } from '../../components/EventCard';
import { ProjectCard } from '../../components/ProjectCard';
import { SectionHeading } from '../../components/SectionHeading';
import { SurveyCard } from '../../components/SurveyCard';
import { UpdateCard } from '../../components/UpdateCard';
import { Route } from '../../routes/index';

const estateImageSource = 'https://www.woodbrookshankill.ie/south-coast';

export function HomePage() {
  const content = Route.useLoaderData();

  return (
    <main className="home-page" id="main-content">
      <section className="hero rooms-hero">
        <div className="shell rooms-hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Hello, neighbour</p>
            <h1>A shared place for everyday Woodbrook.</h1>
            <p className="hero-lede">
              {content.siteSetting?.tagline ??
                'A shared place to know what’s happening, meet people nearby, and help shape our neighbourhood.'}
            </p>
            <p className="hero-intro">
              {content.siteSetting?.introduction ??
                'Find a useful answer, a local date, a neighbourly idea, or a clear next step.'}
            </p>
            <div className="button-row">
              <a className="button" href="#community-start">
                Explore the community hub{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link className="button button-secondary" to="/events">
                See what’s on
              </Link>
            </div>
          </div>

          <figure className="rooms-hero-image">
            <img
              src="/images/woodbrook-coast-aerial.jpg"
              alt="Aerial view across Woodbrook toward the coast, Bray and the Wicklow Mountains"
              width="1920"
              height="1420"
            />
            <figcaption>
              Woodbrook between coast and mountains · aerial image:{' '}
              <a href={estateImageSource} target="_blank" rel="noreferrer">
                Woodbrook Shankill
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section room-directory" id="community-start">
        <div className="shell">
          <div className="rooms-heading">
            <div>
              <p className="eyebrow">A simple way in</p>
              <h2>What do you need today?</h2>
            </div>
            <p>
              One clear starting point for local information, community
              activity, practical help, and ways to contribute.
            </p>
          </div>

          <div className="room-grid">
            <Link className="room-card room-welcome" to="/local-info">
              <span className="room-icon">
                <House size={21} aria-hidden="true" />
              </span>
              <div>
                <small>New to Woodbrook?</small>
                <h3>Find your feet locally</h3>
                <p>
                  Useful places, services, contacts, and everyday essentials.
                </p>
              </div>
              <span className="room-link">
                Open the local guide <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>

            <Link className="room-card room-notice" to="/updates">
              <span className="room-icon">
                <Megaphone size={21} aria-hidden="true" />
              </span>
              <div>
                <small>Keep up</small>
                <h3>Know what’s changing</h3>
                <p>
                  {content.availability === 'ready'
                    ? `${content.updates.length} source-linked local updates.`
                    : 'Source-linked local updates and practical next steps.'}
                </p>
              </div>
              <span className="room-link">
                Browse updates <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>

            <Link className="room-card room-table" to="/events">
              <span className="room-icon">
                <CalendarDays size={21} aria-hidden="true" />
              </span>
              <div>
                <small>Come along</small>
                <h3>Meet and join in</h3>
                <p>
                  {content.availability === 'ready'
                    ? `${content.events.length} ${
                        content.events.length === 1
                          ? 'upcoming date'
                          : 'upcoming dates'
                      } and ways to take part.`
                    : 'Local dates and ways to take part.'}
                </p>
              </div>
              <span className="room-link">
                See what’s on <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>

            <Link className="room-card room-workshop" to="/projects">
              <span className="room-icon">
                <Hammer size={21} aria-hidden="true" />
              </span>
              <div>
                <small>Have a say</small>
                <h3>Help shape the area</h3>
                <p>
                  {content.availability === 'ready'
                    ? `${content.projects.length} local projects being followed.`
                    : 'Local projects, clear sources, and visible next steps.'}
                </p>
              </div>
              <span className="room-link">
                Follow the work <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {content.availability === 'unavailable' ? (
        <section className="section shell">
          <CmsUnavailable />
        </section>
      ) : null}

      {content.updates.length > 0 ? (
        <section className="section section-tint notice-room-section">
          <div className="shell">
            <SectionHeading
              eyebrow="Latest from Woodbrook"
              title="Useful things to know"
              linkLabel="See every update"
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

      {content.events.length > 0 || content.surveys.length > 0 ? (
        <section className="section table-section">
          <div className="shell split-section">
            <div>
              <SectionHeading
                eyebrow="Meet and join in"
                title="Coming up nearby"
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
                title="Open conversations"
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

      {content.projects.length > 0 ? (
        <section className="section workshop-section">
          <div className="shell">
            <SectionHeading
              eyebrow="Neighbourhood projects"
              title="Projects shaping the place"
              linkLabel="View all projects"
              linkTo="/projects"
            />
            <div className="card-grid">
              {content.projects.map((project) => (
                <ProjectCard key={project.documentId} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section help-desk-section">
        <div className="shell help-desk-card">
          <span className="room-icon">
            <CircleAlert size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Contribute or get help</p>
            <h2>Ask, contribute, or raise something useful.</h2>
            <p>
              Send a neighbourhood concern privately, or help make the hub more
              useful for the people who live here.
            </p>
          </div>
          <div className="button-row">
            <Link className="button" to="/report">
              Report an issue <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/get-involved">
              Get involved
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
