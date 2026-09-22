import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { TreatmentHero } from './TreatmentHero';

const TreatmentHeroElement = reactToWebComponent(
  TreatmentHero,
  React,
  ReactDOM,
  {
    props: {
      eyebrow: 'string',
      title: 'string',
      description: 'string',
      scriptFirstLine: 'string',
      scriptSecondLine: 'string',
      scriptThirdLine: 'string',
      imageUrl: 'string',
    },
  },
);

export default TreatmentHeroElement;
