import { ArrowRight, Check, Leaf, Quote, Star } from 'lucide-react';
import { SiteHeader } from '../../components/SiteHeader';
import { Faq } from './Faq';
import { packages, services, steps } from './homeContent';

export function HomePage() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Our services</p>
            <h1 id="hero-title">
              Simple digital
              <br className="desktop-break" /> services for
              <br className="desktop-break" /> local businesses.
            </h1>
            <div className="handdrawn-line" aria-hidden="true" />
            <p className="hero-description">
              Modern websites, local SEO and easy-to-use tools to help you get
              found, look professional and attract more customers.
            </p>
            <div className="hero-actions">
              <a className="button" href="#contact">
                Get Started <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href="#work">
                See Our Work
              </a>
            </div>
          </div>
          <figure className="hero-visual" id="work">
            <img
              src="/images/laura-website-1200.webp"
              srcSet="/images/laura-website-640.webp 640w, /images/laura-website-1200.webp 1200w"
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1180px) 50vw, 610px"
              width={1200}
              height={800}
              className="hero-photo"
              alt="Laptop displaying Laura Faichney’s homepage in a warm, plant-filled café"
              fetchPriority="high"
            />
            <img
              className="hero-note"
              src="/images/handwritten-hero-note.webp"
              width={400}
              height={596}
              alt="Websites that work for real businesses."
            />
            <figcaption>Laura Faichney · All Things Art</figcaption>
          </figure>
        </section>
        <section
          className="services content-inset"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="section-heading">
            <h2 id="services-title">Our services</h2>
            <p>
              All designed for small businesses{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="icon-circle">
                  <service.icon
                    size={31}
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a
                  className="text-link"
                  href="#packages"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn more <ArrowRight size={14} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>
        <section
          className="packages panel"
          id="packages"
          aria-labelledby="packages-title"
        >
          <div className="packages-intro">
            <p className="eyebrow">Packages</p>
            <h2 id="packages-title">
              Choose a package
              <br />
              that suits your goals.
            </h2>
            <p>
              Simple, transparent options designed for small businesses. No
              hidden fees.
            </p>
            <Leaf className="accent-leaf" size={42} aria-hidden="true" />
          </div>
          <div className="package-grid">
            {packages.map((plan) => (
              <article
                className={
                  plan.popular ? 'package-card popular' : 'package-card'
                }
                key={plan.title}
              >
                {plan.popular && (
                  <span className="popular-badge">Most Popular</span>
                )}
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="check">
                        <Check size={11} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="price">From {plan.price}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="process content-inset"
          id="about"
          aria-labelledby="process-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Our process</p>
              <h2 id="process-title">How it works</h2>
            </div>
            <p>
              A simple process from start to finish{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </p>
          </div>
          <ol className="process-grid">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <div className="trust-grid">
          <section
            className="testimonial panel"
            aria-label="Illustrative testimonial"
          >
            <img
              className="testimonial-avatar"
              src="/images/illustrative-owner.webp"
              width={116}
              height={116}
              alt=""
              loading="lazy"
            />
            <Quote
              className="quote-icon"
              fill="currentColor"
              aria-hidden="true"
            />
            <div>
              <blockquote>
                “Forma Studio made the whole process so easy. Our new website
                looks amazing and we’re getting more bookings already!”
              </blockquote>
              <div className="quote-credit">
                <p>
                  <strong>Sophie Bennett</strong>
                  <span>The Gathered Table</span>
                </p>
                <span
                  className="stars"
                  role="img"
                  aria-label="Illustrative five-star rating"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                  ))}
                </span>
              </div>
              <p className="sample-label">
                Illustrative testimonial from the design reference.
              </p>
            </div>
          </section>
          <Faq />
        </div>
        <section
          className="contact panel"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-decoration" aria-hidden="true">
            <Leaf size={112} strokeWidth={0.8} />
          </div>
          <div className="contact-copy">
            <p className="eyebrow">Ready to get started?</p>
            <h2 id="contact-title">
              Let’s build a stronger online presence for your business.
            </h2>
            <p>
              Get a modern website and the tools you need to attract more local
              customers.
            </p>
          </div>
          <div className="contact-action">
            <a className="button" href="mailto:hello@forma.example">
              Email us <ArrowRight size={16} aria-hidden="true" />
            </a>
            <p>No obligation. Just a friendly chat.</p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>Forma Studio · Websites for local businesses</span>
        <span>Design preview · Contact address to be confirmed</span>
      </footer>
    </div>
  );
}
