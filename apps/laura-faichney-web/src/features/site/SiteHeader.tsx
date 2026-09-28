import { useState } from 'react';
import { Arrow } from './Arrow';

export function SiteHeader(props: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['Home', '/'],
    ['About', '/about'],
    ['Services', '/services'],
    ['Gallery', '/gallery'],
    ['Contact', '/contact'],
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          className="wordmark"
          href="/"
          aria-label="Laura Faichney All Things Art, home"
        >
          <span>Laura Faichney</span>
          <small>ALL THINGS ART</small>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={menuOpen ? 'navigation is-open' : 'navigation'}
          aria-label="Primary navigation"
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              aria-current={props.active === href ? 'page' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="button button-primary header-cta" href="/contact">
          Get in Touch <Arrow />
        </a>
      </div>
    </header>
  );
}
