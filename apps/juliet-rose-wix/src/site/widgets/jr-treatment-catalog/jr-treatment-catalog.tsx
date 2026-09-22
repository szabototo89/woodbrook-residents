import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { TreatmentCatalogWidget } from './TreatmentCatalogWidget';

const JrTreatmentCatalogElement = reactToWebComponent(
  TreatmentCatalogWidget,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      bookingBaseUrl: 'string',
    },
  },
);

export default JrTreatmentCatalogElement;
