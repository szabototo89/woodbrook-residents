import type { ReactNode } from 'react';
import { GoldStroke } from './GoldStroke';
import { heroImageSrcSet } from './heroImageSources';
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
          <picture>
            {heroImageSrcSet(props.image, 'avif') && (
              <source
                type="image/avif"
                srcSet={heroImageSrcSet(props.image, 'avif')}
                sizes={
                  props.imageSizes ??
                  '(max-width: 640px) calc(100vw - 40px), (max-width: 1328px) 58vw, 742px'
                }
              />
            )}
            <img
              src={props.image}
              srcSet={props.imageSrcSet ?? heroImageSrcSet(props.image)}
              sizes={
                props.imageSizes ??
                '(max-width: 640px) calc(100vw - 40px), (max-width: 1328px) 58vw, 742px'
              }
              alt={props.imageAlt}
              width="1374"
              height="1145"
              fetchPriority={props.imagePriority ?? 'high'}
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
