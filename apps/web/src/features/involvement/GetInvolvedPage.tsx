import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarPlus,
  ClipboardCheck,
  Megaphone,
} from 'lucide-react';

import { PageIntro } from '../../components/PageIntro';

export function GetInvolvedPage() {
  return (
    <main id="main-content">
      <PageIntro eyebrow="A resident-built resource" title="Help shape the hub">
        <p>
          The first version establishes a reliable public foundation. The next
          step is agreeing a small, transparent resident publishing team and
          practical contribution process.
        </p>
      </PageIntro>
      <section className="section shell">
        <div className="involvement-grid">
          <article>
            <span>
              <ClipboardCheck size={22} aria-hidden="true" />
            </span>
            <h2>Check local information</h2>
            <p>
              Help review source links, dates, contact details, and
              plain-English summaries before they are published.
            </p>
          </article>
          <article>
            <span>
              <CalendarPlus size={22} aria-hidden="true" />
            </span>
            <h2>Share confirmed dates</h2>
            <p>
              Contribute organiser links for resident meetings, clean-ups, and
              events that are open to the Woodbrook community.
            </p>
          </article>
          <article>
            <span>
              <Megaphone size={22} aria-hidden="true" />
            </span>
            <h2>Track a shared issue</h2>
            <p>
              Turn recurring concerns into clear projects with a source, current
              status, accountable next step, and update history.
            </p>
          </article>
        </div>
        <div className="involvement-cta">
          <div>
            <p className="eyebrow">Start with what you can see</p>
            <h2>Report a neighbourhood issue</h2>
            <p>
              A structured report is the quickest way to begin building useful
              evidence about recurring local concerns.
            </p>
          </div>
          <Link className="button" to="/report">
            Open issue form <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
