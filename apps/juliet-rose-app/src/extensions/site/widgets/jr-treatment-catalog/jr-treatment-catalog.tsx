import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { TreatmentCatalogWidget } from './TreatmentCatalogWidget';
import { getTreatmentsAccessTokenInjector } from '../../treatments/treatmentsServices';

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

export default class AuthenticatedTreatmentCatalogElement extends JrTreatmentCatalogElement {
  accessTokenListener = getTreatmentsAccessTokenInjector();
}
