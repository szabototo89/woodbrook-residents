import { ArrowRight, Sprout } from 'lucide-react';

import styles from './jr-treatment-cards.module.css';

type JrTreatmentGuidanceProps = Readonly<{
  contactUrl?: string;
}>;

export function JrTreatmentGuidance(props: JrTreatmentGuidanceProps) {
  const contactUrl = props.contactUrl ?? '/#contact';
  return (
    <aside className={styles.guidance}>
      <Sprout aria-hidden="true" strokeWidth={1.3} />
      <div>
        <h2>Not sure what to choose?</h2>
        <p>
          Get in touch and we’ll be happy to recommend the perfect treatment for
          you.
        </p>
      </div>
      <a className={styles.guidanceButton} href={contactUrl}>
        Contact us <ArrowRight aria-hidden="true" />
      </a>
    </aside>
  );
}
