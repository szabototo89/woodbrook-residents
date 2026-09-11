import { Link } from '@tanstack/react-router';
import { ArrowUpRight, MapPin } from 'lucide-react';

import { clearCookieConsentChoice } from './CookieConsent';

export function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="footer-brand" to="/">
            <span className="brand-mark brand-mark-light" aria-hidden="true">
              W
            </span>
            <span>
              <strong>Woodbrook Residents</strong>
              <small>
                <MapPin size={13} aria-hidden="true" /> Shankill, Dublin 18
              </small>
            </span>
          </Link>
          <p>
            Local information, events, consultations, and practical ways for
            Woodbrook residents to take part.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link to="/updates">Updates</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/events">Events</Link>
          <Link to="/surveys">Consultations</Link>
        </div>
        <div>
          <h2>Take action</h2>
          <Link to="/local-info">Local information</Link>
          <Link to="/get-involved">Get involved</Link>
          <a href="https://www.dlrcoco.ie/" target="_blank" rel="noreferrer">
            DLR County Council <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Woodbrook Residents</span>
        <span>Local facts are linked to their original public sources.</span>
        <button
          type="button"
          className="footer-cookie-settings"
          onClick={clearCookieConsentChoice}
        >
          Cookie settings
        </button>
      </div>
    </footer>
  );
}
