import { ArrowRight, Check, Leaf } from 'lucide-react';
import { SiteHeader } from '../../components/SiteHeader';
import { Faq } from './Faq';
import { SelectedWork } from './SelectedWork';
import {
  enquiryEmail,
  enquiryHref,
  packages,
  services,
  steps,
} from './homeContent';

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
            <p className="eyebrow">Web design & digital support</p>
            <h1 id="hero-title">
              Websites that help
              <br className="desktop-break" /> local businesses
              <br className="desktop-break" /> grow.
            </h1>
            <div className="handdrawn-line" aria-hidden="true" />
            <p className="hero-description">
              Web design, local SEO and simple enquiry tools. Help customers
              find your business, understand your services and get in touch.
            </p>
            <div className="hero-actions">
              <a className="button" href="#contact">
                Discuss your project <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href="#work">
                See Our Work
              </a>
            </div>
          </div>
          <figure className="hero-visual">
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
            <p className="hero-note">Websites that work for real businesses.</p>
            <figcaption>
              Laura Faichney website · Illustrative café mockup
            </figcaption>
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
                <details className="service-details">
                  <summary>What’s included</summary>
                  <ul>
                    {service.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>
        </section>
        <SelectedWork />
        <section
          className="packages panel"
          id="packages"
          aria-labelledby="packages-title"
        >
          <div className="packages-intro">
            <p className="eyebrow">Packages</p>
            <h2 id="packages-title">
              Choose a package <br />
              that suits your goals.
            </h2>
            <p>
              Starting points for your project. Your final quote confirms scope,
              hosting and any ongoing costs before work begins.
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
                  <span className="popular-badge">Website + local SEO</span>
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
                <a className="text-link package-action" href="#contact">
                  Discuss {plan.title}{' '}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
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
            className="project-preparation panel"
            aria-labelledby="preparation-title"
          >
            <p className="eyebrow">Let’s make a start</p>
            <h2 id="preparation-title">
              What to bring to our first conversation
            </h2>
            <p>
              No finished brief needed. A few details help us understand your
              project.
            </p>
            <ul>
              <li>Your business and the customers you want to reach</li>
              <li>Your current website, if you have one</li>
              <li>What you want to improve and your ideal timing</li>
            </ul>
            <a className="text-link" href="#contact">
              Tell us about your project{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
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
              Tell us about your business, what you need and your ideal timing.
              We’ll discuss the scope and next steps with you.
            </p>
          </div>
          <div className="contact-action">
            <a className="button" href={enquiryHref}>
              Email us <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a className="contact-email text-link" href={enquiryHref}>
              {enquiryEmail}
            </a>
            <p>Opens your email app. No obligation.</p>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>Forma Studio · Websites for local businesses</span>
        <span>Web design · Local SEO · Ongoing support</span>
      </footer>
    </div>
  );
}
