import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { ActionLink } from './ActionLink';

import { content } from '../features/content/content';

type SiteHeaderProps = { page?: 'home' | 'blog' };

export function SiteHeader(props: SiteHeaderProps) {
  const settings = content.settings;
  const homePrefix = props.page === 'blog' ? '/' : '';
  const sectionHref = (href: string) =>
    href.startsWith('#') ? `${homePrefix}${href}` : href;
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', dismissOnEscape);
    return () => document.removeEventListener('keydown', dismissOnEscape);
  }, [open]);
  return (
    <header className="site-header">
      <a
        className="brand"
        href={props.page === 'blog' ? '/' : '#main-content'}
        aria-label={`${settings.brand} home`}
      >
        <img
          src={settings.logo.asset.url}
          width={settings.logo.asset.width}
          height={settings.logo.asset.height}
          alt={settings.logo.alt}
        />
      </a>
      <button
        className="menu-toggle"
        ref={toggleRef}
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
        {settings.navigation.map((section) => (
          <a
            key={section._key}
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
      <ActionLink className="header-cta" href={sectionHref('#contact')}>
        {settings.talkLabel}
      </ActionLink>
    </header>
  );
}
