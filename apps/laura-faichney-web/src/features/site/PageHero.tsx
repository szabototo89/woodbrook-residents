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
  imageSrcSet?: string;
  imageSizes?: string;
  imagePriority?: 'high' | 'auto';
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
            srcSet={props.imageSrcSet}
            sizes={props.imageSizes}
            alt={props.imageAlt}
            width="1374"
            height="1145"
            fetchPriority={props.imagePriority ?? 'high'}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </section>
  );
}
