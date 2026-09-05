import { useServerFn } from '@tanstack/react-start';
import { CircleCheck, ShieldAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { PageIntro } from '../../components/PageIntro';
import { issueReportSchema, submitIssueReport } from './reportIssue';

type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export function ReportIssuePage() {
  const submitReport = useServerFn(submitIssueReport);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: 'idle',
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const candidate = {
      category: formData.get('category'),
      location: String(formData.get('location') ?? ''),
      details: String(formData.get('details') ?? ''),
      reporterName: String(formData.get('reporterName') ?? ''),
      reporterEmail: String(formData.get('reporterEmail') ?? ''),
      consent: formData.get('consent') === 'on',
    };
    const result = issueReportSchema.safeParse(candidate);

    if (!result.success) {
      setSubmission({
        status: 'error',
        message:
          'Please choose a category, add a clear location and description, and confirm consent.',
      });
      return;
    }

    setSubmission({ status: 'submitting' });

    try {
      await submitReport({ data: result.data });
      form.reset();
      setSubmission({ status: 'success' });
    } catch {
      setSubmission({
        status: 'error',
        message:
          'Your report could not be saved. Please try again when the service is available.',
      });
    }
  }

  return (
    <main id="main-content">
      <PageIntro eyebrow="Act" title="Report a neighbourhood issue">
        <p>
          Add enough detail to understand the problem and its location. This
          form is for community triage, not emergencies or formal council
          service requests.
        </p>
      </PageIntro>
      <section className="section shell report-layout">
        <aside>
          <div className="safety-card">
            <ShieldAlert size={24} aria-hidden="true" />
            <h2>For urgent danger</h2>
            <p>
              Call 112 or 999. Do not use this form for a threat to life,
              health, property, or the environment.
            </p>
          </div>
          <h2>What happens next?</h2>
          <ol className="process-list">
            <li>The report is stored privately.</li>
            <li>A community editor can review and group recurring issues.</li>
            <li>Appropriate items can be routed to an official service.</li>
          </ol>
        </aside>
        <form className="report-form" onSubmit={handleSubmit} noValidate>
          <label>
            Issue category
            <select name="category" defaultValue="" required>
              <option value="" disabled>
                Choose a category
              </option>
              <option value="lighting">Lighting</option>
              <option value="litter">Litter</option>
              <option value="drainage">Drainage</option>
              <option value="roads-paths">Roads and paths</option>
              <option value="landscaping">Landscaping</option>
              <option value="traffic">Traffic</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Location
            <input
              name="location"
              type="text"
              placeholder="Nearest street, landmark, or Eircode"
              minLength={3}
              maxLength={180}
              required
            />
          </label>
          <label>
            What did you notice?
            <textarea
              name="details"
              rows={7}
              placeholder="Describe the issue, when you noticed it, and anything that would help locate it."
              minLength={15}
              maxLength={3000}
              required
            />
          </label>
          <div className="form-row">
            <label>
              Your name <span>(optional)</span>
              <input name="reporterName" type="text" maxLength={100} />
            </label>
            <label>
              Email <span>(optional)</span>
              <input name="reporterEmail" type="email" />
            </label>
          </div>
          <label className="checkbox-label">
            <input name="consent" type="checkbox" required />
            <span>
              I consent to this information being stored for community issue
              triage. I have not included sensitive personal information.
            </span>
          </label>
          {submission.status === 'error' ? (
            <p className="form-message form-error" role="alert">
              {submission.message}
            </p>
          ) : null}
          {submission.status === 'success' ? (
            <p className="form-message form-success" role="status">
              <CircleCheck size={18} aria-hidden="true" />
              Thank you. Your report has been saved for review.
            </p>
          ) : null}
          <button
            className="button"
            type="submit"
            disabled={submission.status === 'submitting'}
          >
            {submission.status === 'submitting'
              ? 'Submitting…'
              : 'Submit private report'}
          </button>
        </form>
      </section>
    </main>
  );
}
