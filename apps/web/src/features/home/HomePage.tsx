import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  HandHeart,
  House,
  Megaphone,
  MessageSquareText,
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
            <p className="eyebrow">For Woodbrook residents</p>
            <h1>Local information and ways to take part.</h1>
            <p className="hero-lede">
              {content.siteSetting?.tagline ??
                'Keep up with local changes, find practical information, and take part in community life.'}
            </p>
            <p className="hero-intro">
              {content.siteSetting?.introduction ??
                'Browse updates, services, events, projects, and public consultations for Woodbrook and nearby Shankill.'}
            </p>
            <div className="button-row">
              <a className="button" href="#community-start">
                Choose where to start{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link className="button button-secondary" to="/events">
                Browse events
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
              <p className="eyebrow">Start here</p>
              <h2>What would you like to do?</h2>
            </div>
            <p>Choose a section based on the task you want to complete.</p>
          </div>

          <div className="room-grid">
            <Link className="room-card room-welcome" to="/local-info">
              <span className="room-icon">
                <House size={21} aria-hidden="true" />
              </span>
              <div>
                <small>Find practical help</small>
                <h3>Browse local information</h3>
                <p>
                  Useful places, services, contacts, and everyday essentials.
                </p>
              </div>
              <span className="room-link">
                Browse local information{' '}
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>

            <Link className="room-card room-notice" to="/updates">
              <span className="room-icon">
                <Megaphone size={21} aria-hidden="true" />
              </span>
              <div>
                <small>Stay informed</small>
                <h3>Read local updates</h3>
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
                <small>Take part</small>
                <h3>Find upcoming events</h3>
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
                Browse events <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>

            <Link className="room-card room-workshop" to="/surveys">
              <span className="room-icon">
                <MessageSquareText size={21} aria-hidden="true" />
              </span>
              <div>
                <small>Have your say</small>
                <h3>View public consultations</h3>
                <p>
                  Current opportunities to respond and an archive of closed
                  consultations.
                </p>
              </div>
              <span className="room-link">
                View consultations <ArrowRight size={15} aria-hidden="true" />
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
                linkLabel="View all events"
                linkTo="/events"
              />
              {content.events.slice(0, 1).map((event) => (
                <EventCard key={event.documentId} event={event} />
              ))}
            </div>
            <div>
              <SectionHeading
                eyebrow="Have your say"
                title="Public consultations"
                linkLabel="View all consultations"
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
          <div className="help-desk-copy">
            <div className="help-desk-label">
              <span className="help-desk-icon">
                <HandHeart size={20} aria-hidden="true" />
              </span>
              <p className="eyebrow">Ways to help</p>
            </div>
            <h2>Help keep local information useful.</h2>
            <p>
              See what residents can do now, what is still being set up, and
              where to find official help.
            </p>
          </div>
          <div className="button-row">
            <Link className="button" to="/get-involved">
              See ways to help <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
