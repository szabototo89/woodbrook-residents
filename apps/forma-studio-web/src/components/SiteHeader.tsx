import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

const sections = [
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#work' },
  { name: 'About', href: '#about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '#contact' },
];

export function SiteHeader(props: { page?: 'home' | 'blog' }) {
  const homePrefix = props.page === 'blog' ? '/' : '';
  const sectionHref = (href: string) =>
    href.startsWith('#') ? `${homePrefix}${href}` : href;
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a
        className="brand"
        href={props.page === 'blog' ? '/' : '#main-content'}
        aria-label="Forma Studio home"
      >
        <img
          src="/images/forma-studio-logo.webp"
          width={720}
          height={113}
          alt="Forma Studio"
        />
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={open ? 'navigation is-open' : 'navigation'}
      >
        {sections.map((section) => (
          <a
            key={section.href}
            href={sectionHref(section.href)}
            aria-current={
              section.href === '/blog' && props.page === 'blog'
                ? 'page'
                : undefined
            }
            onClick={() => setOpen(false)}
          >
            {section.name}
          </a>
        ))}
      </nav>
      <a className="button header-cta" href={sectionHref('#contact')}>
        Get Started <ArrowRight aria-hidden="true" size={16} />
      </a>
    </header>
  );
}
