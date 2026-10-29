import { content } from '../features/content/content';

interface SiteFooterProps {
  page: 'home' | 'blog';
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="site-footer">
      {props.page === 'home' ? (
        <span>{content.settings.footerServices}</span>
      ) : (
        <a href="/">{content.journal.homeLabel}</a>
      )}
    </footer>
  );
}
