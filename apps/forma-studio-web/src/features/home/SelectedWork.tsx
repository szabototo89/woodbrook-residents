import { ArrowUpRight } from 'lucide-react';
import { Card } from '../../components/Card';

import { content } from '../content/content';

export function SelectedWork() {
  const home = content.home;
  return (
    <section
      className="selected-work content-inset"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{home.workEyebrow}</p>
          <h2 id="work-title">{home.workTitle}</h2>
        </div>
        <p>{home.workDescription}</p>
      </div>
      {home.selectedWork.map((work) => (
        <Card
          key={work._id}
          as="article"
          variant="white"
          padding="none"
          className="work-card"
        >
          <a
            className="work-preview"
            href={work.url}
            aria-label={work.previewLabel}
          >
            <div className="work-preview-bar" aria-hidden="true">
              <span className="work-window-dots">
                <span />
                <span />
                <span />
              </span>
              <span>{work.windowTitle}</span>
              <ArrowUpRight size={15} />
            </div>
            <img
              src={work.image.asset.url}
              width={work.image.asset.width}
              height={work.image.asset.height}
              loading="lazy"
              alt={work.image.alt}
            />
          </a>
          <div className="work-copy">
            <div>
              <p className="eyebrow">{work.eyebrow}</p>
              <h3>{work.title}</h3>
            </div>
            <div className="work-summary">
              <p>{work.description}</p>
              <a className="text-link" href={work.url}>
                {work.action} <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
