import { BrandLogo } from '../../components/BrandLogo';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <BrandLogo footer />
        <nav aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/gallery">Gallery</a>
          <a href="/contact">Contact</a>
        </nav>
        <nav className="social-links" aria-label="Social media">
          {/* Instagram remains the user-requested placeholder. */}
          <a href="https://www.instagram.com/" aria-label="Instagram">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61553821975045"
            aria-label="Facebook"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5C17.2 1.2 16.3 1 15 1c-3 0-5 1.8-5 5v3H7v4h3v9z" />
            </svg>
          </a>
        </nav>
        <small>
          © {new Date().getFullYear()} Laura Faichney All Things Art
        </small>
      </div>
    </footer>
  );
}
