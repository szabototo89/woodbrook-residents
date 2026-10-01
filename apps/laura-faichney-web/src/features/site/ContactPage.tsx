import { Arrow } from './Arrow';
import { ContactDetails } from './ContactDetails';
import { PageHero } from './PageHero';
import type { CmsSettings } from './lauraSanity';

export function ContactPage(props: { settings: CmsSettings }) {
  const { settings } = props;
  return (
    <main id="main-content">
      <PageHero
        className="contact-hero"
        eyebrow="Let’s create something special"
        title="Get in Touch"
        description="Whether it’s a commissioned painting, mural, event or creative session, I’d love to hear from you."
        image="/artwork/contact-hero-cutout.webp"
        imageAlt="A blank note with a painted flower, an envelope, and an artist’s brush"
        action={
          <a
            className="button button-primary"
            href={`mailto:${settings.email}?subject=${encodeURIComponent(settings.mailtoSubject)}`}
          >
            Start a Project <Arrow />
          </a>
        }
      />
      <section className="section contact-page contact-page-details">
        <div className="container">
          <ContactDetails settings={settings} />
        </div>
      </section>
    </main>
  );
}
