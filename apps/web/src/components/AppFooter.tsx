import { Link } from '@tanstack/react-router';
import { ArrowUpRight, MapPin } from 'lucide-react';

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
              <strong>Woodbrook Community Hub</strong>
              <small>
                <MapPin size={13} aria-hidden="true" /> Shankill, Dublin 18
              </small>
            </span>
          </Link>
          <p>
            A shared place for useful local information, neighbourly activity,
            and clear ways to help shape Woodbrook.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link to="/updates">Updates</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/events">Events</Link>
          <Link to="/surveys">Have your say</Link>
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
        <span>© 2026 Woodbrook Community Hub</span>
        <span>Local facts are linked to their original public sources.</span>
      </div>
    </footer>
  );
}
