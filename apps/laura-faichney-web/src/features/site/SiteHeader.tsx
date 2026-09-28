import { useRef, useState } from 'react';
import { Arrow } from './Arrow';
import { BrandLogo } from '../../components/BrandLogo';

export function SiteHeader(props: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const links = [
    ['Home', '/'],
    ['About', '/about'],
    ['Services', '/services'],
    ['Gallery', '/gallery'],
    ['Contact', '/contact'],
  ];

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="container header-inner">
        <BrandLogo />
        <button
          ref={menuButton}
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
