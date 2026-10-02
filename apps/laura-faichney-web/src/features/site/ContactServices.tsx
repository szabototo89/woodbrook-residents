import { Paintbrush, PaintRoller, Users } from 'lucide-react';
import { Eyebrow } from './Eyebrow';
import { GoldStroke } from './GoldStroke';
import { ServiceImage } from './ServiceImage';
import type { CmsService } from './lauraSanity';

const groups = [
  {
    title: 'Commissioned Paintings',
    slugs: ['commissioned-paintings'],
    icon: Paintbrush,
  },
  {
    title: 'Murals & Signage',
    slugs: ['murals-indoor-outdoor', 'signage'],
    icon: PaintRoller,
  },
  {
    title: 'Facepainting & Art Tutoring',
    slugs: ['facepainting', 'art-tutoring'],
    icon: Users,
  },
];

export function ContactServices(props: { services: CmsService[] }) {
  return (
    <section
      className="contact-services"
      aria-labelledby="contact-services-heading"
    >
      <div className="container">
        <div className="contact-services-heading">
          <div>
            <Eyebrow>Enquiries welcome</Eyebrow>
            <h2 id="contact-services-heading">Ways I Can Help</h2>
          </div>
          <GoldStroke />
          <img
            className="contact-motto"
            src="/decoration/art-brings-people-together.png"
            alt="Art brings people together"
            width="1448"
            height="1086"
            loading="lazy"
          />
        </div>
        <div className="contact-service-grid">
          {groups.map((group) => {
            const services = group.slugs.flatMap((slug) =>
              props.services.filter((service) => service.slug === slug),
            );
            const first = services[0];
            if (!first) return null;
            return (
              <a
                className="contact-service-card"
                href={`/contact?service=${encodeURIComponent(first.slug)}#enquiry`}
                key={group.title}
              >
                <ServiceImage image={first.image} />
                <div className="contact-service-copy">
                  <span className="contact-icon">
                    <group.icon
                      size={30}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <h3>{services.length > 1 ? group.title : first.title}</h3>
                  <p>
                    {services.map((service) => service.description).join(' ')}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
        <a className="contact-all-services" href="/services">
          Explore all creative services
        </a>
      </div>
    </section>
  );
}
