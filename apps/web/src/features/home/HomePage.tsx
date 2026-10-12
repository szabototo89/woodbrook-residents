import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Landmark,
  Phone,
  Users,
} from 'lucide-react';
import { CmsUnavailable } from '../../components/CmsUnavailable';
import { HomeProjectRow } from './HomeProjectRow';
import { SurveyCard } from '../../components/SurveyCard';
import { Route } from '../../routes/index';
import { selectHomeEvent } from '../events/homeEvent';
import { HomeEventCard } from './HomeEventCard';
import { HomeHero } from './HomeHero';
import { HomeServices } from './HomeServices';
import { HomeUpdates } from './HomeUpdates';

export function HomePage() {
  const content = Route.useLoaderData();
  const homeEvent = selectHomeEvent(content.events);
  return (
    <main className="home-page" id="main-content">
      <HomeHero />

      <div className="shell home-content">
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        <div className="home-highlights">
          <HomeUpdates updates={content.updates} />
          {homeEvent ? (
            <HomeEventCard event={homeEvent} />
          ) : (
            <section className="home-event-empty home-panel">
              <CalendarDays size={34} aria-hidden="true" />
              <p className="location-pill">Local dates</p>
              <h2>No upcoming events published</h2>
              <p>
                Check the events page for local dates and ways to take part.
              </p>
              <Link className="button" to="/events">
                Browse events <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </section>
          )}
        </div>

        <HomeServices />

        <div className="home-lower-grid">
          {content.projects.length > 0 ? (
            <section
              className="home-projects home-panel"
              aria-labelledby="home-projects-title"
            >
              <div className="home-section-heading">
                <h2 id="home-projects-title">Community projects</h2>
                <Link to="/projects">
                  View all projects <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className="home-project-list">
                {content.projects.slice(0, 3).map((project) => (
                  <HomeProjectRow key={project.documentId} project={project} />
                ))}
              </div>
            </section>
          ) : null}
          {content.surveys.length > 0 ? (
            <section
              className="home-consultations home-panel"
              aria-labelledby="home-consultations-title"
            >
              <div className="home-section-heading">
                <h2 id="home-consultations-title">Public consultations</h2>
                <Link to="/surveys">
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              {content.surveys.slice(0, 1).map((survey) => (
                <SurveyCard key={survey.documentId} survey={survey} />
              ))}
            </section>
          ) : null}
          <section
            className="home-contact home-panel"
            aria-labelledby="home-contact-title"
          >
            <h2 id="home-contact-title">Who should I contact?</h2>
            <p>Find a starting point for your question.</p>
            <a href="/local-info?category=council">
              <Landmark size={24} aria-hidden="true" />
              <span>
                <strong>Council services</strong>
                <small>Public services and local information</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </a>
            <Link to="/local-info">
              <Phone size={24} aria-hidden="true" />
              <span>
                <strong>Useful contacts</strong>
                <small>Find a local service or provider</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </Link>
            <Link to="/get-involved">
              <Users size={24} aria-hidden="true" />
              <span>
                <strong>Get involved</strong>
                <small>Ways to take part and find help</small>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </Link>
          </section>
        </div>
        <section className="home-about">
          <p>
            {content.siteSetting?.tagline ??
              'Local information. Shared community.'}
          </p>
          <p>
            {content.siteSetting?.introduction ??
              'Stay informed, follow local change and find ways to take part.'}
          </p>
          <Link to="/get-involved">
            Help keep local information useful{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
