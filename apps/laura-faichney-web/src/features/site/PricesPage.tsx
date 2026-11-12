import type { PricesData } from './lauraSanity';
import { GoldStroke } from './GoldStroke';
import { ServiceImage } from './ServiceImage';
import { Arrow } from './Arrow';
import { PriceCategorySection } from './PriceCategorySection';

type PricesPageProps = { data: PricesData };
export function PricesPage(props: PricesPageProps) {
  const { data } = props;
  return (
    <main id="main-content" className="prices-page">
      <div className="container prices-container">
        <header className="prices-intro">
          {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
          <h1>{data.title}</h1>
          <GoldStroke />
          <p className="prices-description">{data.introduction}</p>
        </header>
        <div className="prices-guide">
          {data.categories.map((category, index) => (
            <PriceCategorySection
              key={index}
              category={category}
              fallbackQuote={data.fallbackQuote}
              fallbackGuidance={data.fallbackGuidance}
              enquiryLabel={data.enquiryLabel}
            />
          ))}
        </div>
        {data.sharedNotes.length > 0 && (
          <aside className="prices-notes" aria-label="Pricing notes">
            {data.sharedNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </aside>
        )}
        {data.inspiration.length > 0 && (
          <section
            className="prices-inspiration"
            aria-labelledby="prices-inspiration-heading"
          >
            <div className="prices-inspiration-heading">
              <h2 id="prices-inspiration-heading">A little inspiration</h2>
              <a href="/gallery">
                View Gallery <Arrow />
              </a>
            </div>
            <div className="prices-artwork">
              {data.inspiration.map((image, index) => (
                <a
                  href="/gallery"
                  key={index}
                  aria-label={`View gallery: ${image.alt}`}
                >
                  <ServiceImage
                    image={image}
                    sizes="(max-width: 700px) calc((100vw - 64px) / 3), (max-width: 1328px) calc((100vw - 120px) / 3.5), 340px"
                  />
                </a>
              ))}
              <img
                className="prices-motto"
                src="/decoration/art-brings-people-together-240.webp"
                alt="Art brings people together"
                width="240"
                height="180"
                loading="lazy"
              />
            </div>
          </section>
        )}
        <section
          className="prices-contact"
          aria-labelledby="prices-contact-heading"
        >
          <div>
            <h2 id="prices-contact-heading">{data.contactHeading}</h2>
            <GoldStroke />
          </div>
          <p>{data.contactCopy}</p>
          <div className="prices-contact-actions">
            <a className="button button-primary" href="/gallery">
              View Gallery <Arrow />
            </a>
            <a className="button prices-quote" href="/contact">
              Get a Quote <Arrow />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
