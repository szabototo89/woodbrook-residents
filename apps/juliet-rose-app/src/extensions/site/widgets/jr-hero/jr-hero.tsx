import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { Hero } from './Hero';

const HeroElement = reactToWebComponent(Hero, React, ReactDOM, {
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
  },
});

export default HeroElement;
