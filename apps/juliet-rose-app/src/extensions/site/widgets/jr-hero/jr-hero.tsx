import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { Hero, type HeroProps } from './Hero';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
} from '../../homeContent/homeContent';
import { getHomeContentAccessTokenInjector } from '../../homeContent/homeContentServices';
import { useHomeContent } from '../../homeContent/useHomeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

export type LiveHeroProps = HeroProps &
  Readonly<{ viewMode?: ServicesViewMode }>;

export function LiveHero(props: LiveHeroProps) {
  const viewMode = useWixViewMode(props.viewMode);
  const content = useHomeContent(viewMode);
  return (
    <Hero
      {...props}
      eyebrow={mergeText(
        props.eyebrow,
        content?.heroEyebrow,
        HOME_CONTENT_DEFAULTS.heroEyebrow,
      )}
      title={mergeText(
        props.title,
        content?.heroTitle,
        HOME_CONTENT_DEFAULTS.heroTitle,
      )}
      location={mergeText(
        props.location,
        content?.heroLocation,
        HOME_CONTENT_DEFAULTS.heroLocation,
      )}
      copy={mergeText(
        props.copy,
        content?.heroCopy,
        HOME_CONTENT_DEFAULTS.heroCopy,
      )}
      copySecondLine={mergeText(
        props.copySecondLine,
        content?.heroCopySecondLine,
        HOME_CONTENT_DEFAULTS.heroCopySecondLine,
      )}
      imageAlt={mergeText(
        props.imageAlt,
        content?.heroImageAlt,
        HOME_CONTENT_DEFAULTS.heroImageAlt,
      )}
    />
  );
}

const HeroElement = reactToWebComponent(LiveHero, React, ReactDOM, {
  props: {
    eyebrow: 'string',
    title: 'string',
    location: 'string',
    copy: 'string',
    copySecondLine: 'string',
    bookingUrl: 'string',
    treatmentsUrl: 'string',
    policyUrl: 'string',
    imageUrl: 'string',
    imageSrcSet: 'string',
    imageAlt: 'string',
    viewMode: 'string',
  },
});

export default class AuthenticatedHeroElement extends HeroElement {
  accessTokenListener = getHomeContentAccessTokenInjector();
}
