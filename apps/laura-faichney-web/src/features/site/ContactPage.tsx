import { Arrow } from './Arrow';
import { ContactDetails } from './ContactDetails';
import { ContactSection } from './ContactSection';
import { ContactServices } from './ContactServices';
import { EnquiryForm } from './EnquiryForm';
import { EnquiryGuide } from './EnquiryGuide';
import { PageHero } from './PageHero';
import { ServicesProcess } from './ServicesProcess';
import { MapPin } from 'lucide-react';
import type { CmsService, CmsSettings } from './lauraSanity';

export function ContactPage(props: {
  settings: CmsSettings;
  services: CmsService[];
  selectedService?: string;
}) {
  const { settings } = props;
  return (
    <main id="main-content" className="contact-reference-page">
      <PageHero
        className="contact-hero"
        eyebrow="Let’s create something special"
        title="Get in Touch"
        description="Whether it’s a commissioned painting, mural, event or creative session, I’d love to hear from you."
        image="/artwork/contact-studio-cutout.webp"
        imageSrcSet="/artwork/contact-studio-cutout-480.webp 480w, /artwork/contact-studio-cutout-960.webp 960w, /artwork/contact-studio-cutout.webp 1374w"
        imageSizes="(max-width: 640px) 280px, (max-width: 768px) 44vw, 60vw"
        imageAlt="Artist’s brushes in a colourful floral jug beside pink flowers and a painted sketchbook"
        action={
          <>
            <a
              className="button button-primary"
              href="#enquiry"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById('enquiry')
                  ?.scrollIntoView({ block: 'start' });
                document
                  .getElementById('enquiry-name')
                  ?.focus({ preventScroll: true });
              }}
            >
              Start a Project <Arrow />
            </a>
            <ContactDetails settings={settings} />
            <p className="contact-location">
              <MapPin size={24} strokeWidth={1.5} aria-hidden="true" />
              <span>
                Based in Dublin
                <small>
                  Available for commissions & events across Ireland.
                </small>
              </span>
            </p>
          </>
        }
      />
      <section className="contact-enquiry" aria-label="Project enquiry">
        <div className="container contact-enquiry-grid">
          <EnquiryForm
            key={props.selectedService ?? ''}
            settings={settings}
            services={props.services}
            selectedService={props.selectedService}
          />
          <EnquiryGuide />
        </div>
      </section>
      <ContactServices services={props.services} />
      <ServicesProcess />
      <ContactSection settings={settings} />
    </main>
  );
}
