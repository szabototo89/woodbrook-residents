import { ArrowUpRight } from 'lucide-react';
import { Card } from '../../components/Card';
import { ActionLink } from '../../components/ActionLink';
import { SectionHeading } from '../../components/SectionHeading';

import { content } from '../content/content';

export function SelectedWork() {
  const home = content.home;
  return (
    <section
      className="selected-work content-inset"
      id="work"
      aria-labelledby="work-title"
    >
      <SectionHeading
        id="work-title"
        title={home.workTitle}
        eyebrow={home.workEyebrow}
        description={home.workDescription}
      />
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
              <ActionLink
                variant="text"
                arrow="up-right"
                iconSize={17}
                href={work.url}
              >
                {work.action}
              </ActionLink>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
