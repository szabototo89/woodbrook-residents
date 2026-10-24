import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { ContactDetails } from './ContactDetails';
import type { CmsSettings } from './lauraSanity';

type ContactSectionProps = { settings: CmsSettings };

export function ContactSection(props: ContactSectionProps) {
  const { settings } = props;
  return (
    <section className="contact-section" id="contact">
      <div className="container contact-inner">
        <div>
          <Eyebrow>{settings.eyebrow}</Eyebrow>
          <h2>{settings.heading}</h2>
          <p>{settings.copy}</p>
        </div>
        <ContactDetails settings={settings} />
        <a
          className="button button-primary"
          href={`mailto:${settings.email}?subject=${encodeURIComponent(settings.mailtoSubject)}`}
        >
          Start a Project <Arrow />
        </a>
      </div>
    </section>
  );
}
