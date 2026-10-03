import { useState } from 'react';
import { ArrowRight, Leaf, Menu, X } from 'lucide-react';

const sections = [
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#work' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="#main-content" aria-label="Locale home">
        <Leaf aria-hidden="true" />
        Locale
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
            href={section.href}
            onClick={() => setOpen(false)}
          >
            {section.name}
          </a>
        ))}
      </nav>
      <a className="button header-cta" href="#contact">
        Get Started <ArrowRight aria-hidden="true" size={16} />
      </a>
    </header>
  );
}
