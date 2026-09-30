import type { ReactNode } from 'react';
import { GoldStroke } from './GoldStroke';
import { Eyebrow } from './Eyebrow';

type PageHeroProps = {
  className: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  image: string;
  imageAlt: string;
  action?: ReactNode;
};

export function PageHero(props: PageHeroProps) {
  return (
    <section className={`page-hero ${props.className}`}>
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <Eyebrow>{props.eyebrow}</Eyebrow>
          <h1>{props.title}</h1>
          <GoldStroke />
          <p>{props.description}</p>
          {props.action}
        </div>
        <div className="page-hero-art">
          <img
            src={props.image}
            alt={props.imageAlt}
            width="1374"
            height="1145"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
