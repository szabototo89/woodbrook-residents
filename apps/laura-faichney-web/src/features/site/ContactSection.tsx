import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { ContactDetails } from './ContactDetails';

export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="container contact-inner">
        <div>
          <Eyebrow>Let’s create something special</Eyebrow>
          <h2>Get in Touch</h2>
          <p>
            Have a painting, mural, event or creative session in mind? I’d love
            to hear from you.
          </p>
        </div>
        <ContactDetails />
        <a
          className="button button-primary"
          href="mailto:lauralfaichney@gmail.com?subject=Art%20project%20enquiry"
        >
          Start a Project <Arrow />
        </a>
      </div>
    </section>
  );
}
