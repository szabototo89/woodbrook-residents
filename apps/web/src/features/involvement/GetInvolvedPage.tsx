import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  FolderSearch,
  Mail,
} from 'lucide-react';

import { PageIntro } from '../../components/PageIntro';
import { Route } from '../../routes/get-involved';

export function GetInvolvedPage() {
  const siteSetting = Route.useLoaderData();

  return (
    <main id="main-content">
      <PageIntro eyebrow="Ways to help" title="How residents can contribute">
        <p>
          Woodbrook Residents is currently a read-only public resource. A
          resident publishing process is still being set up, so the site does
          not yet accept event submissions or issue reports.
        </p>
      </PageIntro>
      <section className="section shell">
        <div className="involvement-grid">
          <article id="corrections">
            <span>
              <ClipboardCheck size={22} aria-hidden="true" />
            </span>
            <h2>Suggest a correction</h2>
            <p>
              Check the linked original source first. If the directory differs
              from that source, tell the resident publishing team when its
              contact channel is available.
            </p>
            {siteSetting?.contactEmail ? (
              <a
                className="text-link"
                href={`mailto:${siteSetting.contactEmail}?subject=Woodbrook%20Residents%20correction`}
              >
                <Mail size={16} aria-hidden="true" /> Email a correction
              </a>
            ) : (
              <p>
                <strong>Current status:</strong> corrections are not open yet.
                Use each listing’s source link for the latest information.
              </p>
            )}
          </article>
          <article>
            <span>
              <CalendarDays size={22} aria-hidden="true" />
            </span>
            <h2>Check community events</h2>
            <p>
              Browse confirmed dates and follow the organiser link before
              travelling. Event submissions will open only when the publishing
              process is ready.
            </p>
            <Link className="text-link" to="/events">
              Browse events <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <span>
              <FolderSearch size={22} aria-hidden="true" />
            </span>
            <h2>Follow local projects</h2>
            <p>
              Read the latest known status and next step, then use the linked
              official source for decisions, consultations, and contact routes.
            </p>
            <Link className="text-link" to="/projects">
              View projects <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
