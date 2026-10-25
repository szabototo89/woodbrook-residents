import type { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

interface SiteLayoutProps {
  page?: 'home' | 'blog';
  children: ReactNode;
}

export function SiteLayout(props: SiteLayoutProps) {
  const page = props.page ?? 'home';
  return (
    <div className={page === 'blog' ? 'site-shell blog-shell' : 'site-shell'}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader page={page} />
      <main id="main-content" tabIndex={-1}>
        {props.children}
      </main>
      <SiteFooter page={page} />
    </div>
  );
}
