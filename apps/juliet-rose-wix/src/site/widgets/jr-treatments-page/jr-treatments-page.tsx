import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { TreatmentsPageWidget } from './TreatmentsPageWidget';

const TreatmentsPageElement = reactToWebComponent(
  TreatmentsPageWidget,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      bookingBaseUrl: 'string',
      contactUrl: 'string',
      heroEyebrow: 'string',
      heroTitle: 'string',
      heroDescription: 'string',
      heroImageUrl: 'string',
    },
  },
);

export default TreatmentsPageElement;
