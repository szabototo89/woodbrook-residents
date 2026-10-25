import { Fragment } from 'react';
import { Check, Leaf } from 'lucide-react';
import { SiteLayout } from '../../components/SiteLayout';
import { ActionLink } from '../../components/ActionLink';
import { SectionHeading } from '../../components/SectionHeading';
import { IconBadge } from '../../components/IconBadge';
import { Disclosure } from '../../components/Disclosure';
import { Card } from '../../components/Card';
import { Faq } from './Faq';
import { SelectedWork } from './SelectedWork';
import { content, enquiryHref } from '../content/content';
import { imageUrl } from '../content/image';
import { serviceIcons } from './serviceIcons';

export function HomePage() {
  const { home, settings } = content;
  const { services, packages, steps } = home;
  return (
    <SiteLayout>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">{home.hero.eyebrow}</p>
          <h1 id="hero-title">
            {home.hero.title.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && (
                  <>
                    {' '}
                    <br className="desktop-break" />
                  </>
                )}
                {line}
              </Fragment>
            ))}
          </h1>
          <div className="handdrawn-line" aria-hidden="true" />
          <p className="hero-description">{home.hero.description}</p>
          <div className="hero-actions">
            <ActionLink href="#contact" iconSize={18}>
              {home.hero.action}
            </ActionLink>
            <a className="text-link" href="#work">
              {home.hero.workAction}
            </a>
          </div>
        </div>
        <figure className="hero-visual">
          <img
            src={imageUrl(home.hero.image)}
            srcSet={`${imageUrl(home.hero.image, 640)} 640w, ${imageUrl(home.hero.image, 1200)} 1200w`}
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1180px) 50vw, 610px"
            width={home.hero.image.asset.width}
            height={home.hero.image.asset.height}
            className="hero-photo"
            alt={home.hero.image.alt}
            fetchPriority="high"
          />
          <p className="hero-note">{home.hero.note}</p>
          <figcaption>{home.hero.caption}</figcaption>
        </figure>
      </section>
      <section
        className="services content-inset"
        id="services"
        aria-labelledby="services-title"
      >
        <SectionHeading
          id="services-title"
          title={home.servicesTitle}
          description={home.servicesDescription}
          descriptionArrow
        />
        <div className="service-grid">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon];
            return (
              <Card
                as="article"
                variant="muted"
                className="service-card"
                key={service._key}
              >
                <IconBadge variant="service" icon={Icon} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Disclosure variant="service" summary={home.includesLabel}>
                  <ul>
                    {service.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Disclosure>
              </Card>
            );
          })}
        </div>
      </section>
      <SelectedWork />
      <Card
        variant="panel"
        padding="lg"
        className="packages"
        id="packages"
        aria-labelledby="packages-title"
      >
        <div className="packages-intro">
          <p className="eyebrow">{home.packagesEyebrow}</p>
          <h2 id="packages-title">
            {home.packagesTitle.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && (
                  <>
                    {' '}
                    <br />
                  </>
                )}
                {line}
              </Fragment>
            ))}
          </h2>
          <p>{home.packagesDescription}</p>
          <Leaf className="accent-leaf" size={42} aria-hidden="true" />
        </div>
        <div className="package-grid">
          {packages.map((plan) => (
            <Card
              as="article"
              variant="white"
              popular={plan.popular}
              className="package-card"
              key={plan._key}
            >
              {plan.popular && (
                <span className="popular-badge">{home.popularLabel}</span>
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
              <p className="price">
                {home.pricePrefix} {plan.price}
              </p>
              <ActionLink
                variant="text"
                className="package-action"
                href="#contact"
              >
                {home.packageAction} {plan.title}
              </ActionLink>
            </Card>
          ))}
        </div>
      </Card>
      <section
        className="process content-inset"
        id="about"
        aria-labelledby="process-title"
      >
        <SectionHeading
          id="process-title"
          title={home.processTitle}
          eyebrow={home.processEyebrow}
          description={home.processDescription}
          descriptionArrow
        />
        <ol className="process-grid">
          {steps.map((step, index) => (
            <li key={step._key}>
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
        <Card
          variant="panel"
          padding="md"
          className="project-preparation"
          aria-labelledby="preparation-title"
        >
          <p className="eyebrow">{home.preparation.eyebrow}</p>
          <h2 id="preparation-title">{home.preparation.title}</h2>
          <p>{home.preparation.description}</p>
          <ul>
            {home.preparation.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ActionLink variant="text" href="#contact">
            {home.preparation.action}
          </ActionLink>
        </Card>
        <Faq />
      </div>
      <Card
        variant="panel"
        padding="lg"
        className="contact"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="contact-decoration" aria-hidden="true">
          <Leaf size={112} strokeWidth={0.8} />
        </div>
        <div className="contact-copy">
          <p className="eyebrow">{home.contact.eyebrow}</p>
          <h2 id="contact-title">{home.contact.title}</h2>
          <p>{home.contact.description}</p>
        </div>
        <div className="contact-action">
          <ActionLink href={enquiryHref()}>{home.contact.action}</ActionLink>
          <a className="contact-email text-link" href={enquiryHref()}>
            {settings.enquiryEmail}
          </a>
          <p>{home.contact.note}</p>
        </div>
      </Card>
    </SiteLayout>
  );
}
