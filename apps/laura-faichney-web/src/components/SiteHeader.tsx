import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

type SiteHeaderProps = { active: string };

export function SiteHeader(props: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const links = [
    ['Home', '/'],
    ['About', '/about'],
    ['Services', '/services'],
    ['Prices', '/prices'],
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
              onClick={() => setMenuOpen(false)}
              href={href}
              aria-current={
                props.active === href ||
                (href === '/gallery' && props.active.startsWith('/gallery/'))
                  ? 'page'
                  : undefined
              }
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="button button-primary header-cta" href="/contact">
          Get in Touch{' '}
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
