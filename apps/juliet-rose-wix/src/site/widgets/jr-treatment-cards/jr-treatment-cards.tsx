import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import {
  JrTreatmentCards,
  type TreatmentCardsDisplay,
  type TreatmentCardsViewMode,
} from './JrTreatmentCards';

const JrTreatmentCardsElement = reactToWebComponent(
  JrTreatmentCards,
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

export default JrTreatmentCardsElement;
export type { TreatmentCardsDisplay, TreatmentCardsViewMode };
