import { Heart, MapPin, Palette, Sparkles } from 'lucide-react';
import { Arrow } from './Arrow';
import { ContactSection } from './ContactSection';
import { GoldStroke } from './GoldStroke';
import { PageHero } from './PageHero';
import { TitleLines } from './TitleLines';
import { splitBalancedLines, type AboutData } from './lauraSanity';

const valueIcons: Record<string, typeof Palette> = {
  palette: Palette,
  heart: Heart,
  sparkles: Sparkles,
  pin: MapPin,
};

export function AboutPage(props: { data: AboutData }) {
  const { data } = props;
  return (
    <main id="main-content">
      <PageHero
        className="about-hero"
        eyebrow={data.hero.eyebrow}
        title={<TitleLines lines={data.hero.titleLines} />}
        description={data.hero.description}
        image={data.hero.image.url}
        imageAlt={data.hero.image.alt}
        action={
          data.hero.ctaLabel ? (
            <a className="button button-primary" href="/contact">
              {data.hero.ctaLabel} <Arrow />
            </a>
          ) : undefined
        }
      />
      <section className="values">
        <div className="container values-grid">
          {data.values.map((value) => {
            const Icon = valueIcons[value.icon] ?? Palette;
            return (
              <div key={value.title}>
                <span className="values-icon" aria-hidden="true">
                  <Icon size={44} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h2>
                  <TitleLines lines={splitBalancedLines(value.title)} />
                </h2>
                <p>{value.text}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section story">
        <div className="container story-inner">
          <div>
            <h2>{data.storyHeading}</h2>
            <GoldStroke />
            <p>{data.storyBody}</p>
          </div>
          <img
            src={data.storyImage.url}
            alt={data.storyImage.alt}
            width="1122"
            height="1402"
            loading="lazy"
          />
        </div>
      </section>
      <ContactSection settings={data.settings} />
    </main>
  );
}
