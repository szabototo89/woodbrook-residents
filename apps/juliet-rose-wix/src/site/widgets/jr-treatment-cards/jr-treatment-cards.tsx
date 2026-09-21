import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import {
  TreatmentCards,
  type TreatmentCardsDisplay,
  type TreatmentCardsViewMode,
} from './TreatmentCards';

const TreatmentCardsElement = reactToWebComponent(
  TreatmentCards,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      display: 'string',
      featuredSlugs: 'string',
    },
  },
);

export default TreatmentCardsElement;
export type { TreatmentCardsDisplay, TreatmentCardsViewMode };
