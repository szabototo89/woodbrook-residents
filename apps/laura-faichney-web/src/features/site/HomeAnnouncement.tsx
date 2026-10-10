import { Arrow } from './Arrow';
import type { CmsAnnouncement } from './lauraSanity';

export function HomeAnnouncement(props: { announcement: CmsAnnouncement }) {
  const { announcement } = props;
  return (
    <section
      className="home-announcement"
      aria-labelledby="home-announcement-title"
    >
      <div className="container">
        <div className="announcement-card">
          <div className="announcement-copy">
            <p className="eyebrow">From the studio</p>
            <h2 id="home-announcement-title">{announcement.title}</h2>
            <p className="announcement-message">{announcement.message}</p>
          </div>
          {announcement.link && (
            <a
              className="button button-primary announcement-action"
              href={announcement.link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${announcement.link.label} (opens in a new tab)`}
            >
              {announcement.link.label} <Arrow />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
