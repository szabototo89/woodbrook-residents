import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { LiveTreatmentCatalog } from './LiveTreatmentCatalog';

const JrTreatmentCatalogElement = reactToWebComponent(
  LiveTreatmentCatalog,
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
