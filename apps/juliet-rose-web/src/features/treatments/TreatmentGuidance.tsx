import { ArrowRight, Sprout } from 'lucide-react';

export function TreatmentGuidance() {
  return (
    <aside className="treatment-guidance page-width">
      <Sprout aria-hidden="true" strokeWidth={1.3} />
      <div>
        <h2>Not sure what to choose?</h2>
        <p>
          Get in touch and we’ll be happy to recommend the perfect treatment for
          you.
        </p>
      </div>
      <a className="primary-button" href="/#contact">
        Contact us <ArrowRight aria-hidden="true" />
      </a>
    </aside>
  );
}
