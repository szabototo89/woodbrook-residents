import { Eyebrow } from './Eyebrow';
import { GoldStroke } from './GoldStroke';
import { Arrow } from './Arrow';
import { ContactDetails } from './ContactDetails';

export function ContactPage() {
  return (
    <main id="main-content">
      <section className="section contact-page">
        <div className="container">
          <Eyebrow>Let’s create something special</Eyebrow>
          <h1>Get in Touch</h1>
          <GoldStroke />
          <p>
            Whether it’s a commissioned painting, mural, event or creative
            session, I’d love to hear from you.
          </p>
          <ContactDetails />
          <a
            className="button button-primary"
            href="mailto:lauralfaichney@gmail.com?subject=Art%20project%20enquiry"
          >
            Start a Project <Arrow />
          </a>
        </div>
      </section>
    </main>
  );
}
