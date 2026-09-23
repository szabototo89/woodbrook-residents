import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { TreatmentsPageWidget } from './TreatmentsPageWidget';
import { getTreatmentsAccessTokenInjector } from '../../treatments/treatmentsServices';

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

export default class AuthenticatedTreatmentsPageElement extends TreatmentsPageElement {
  accessTokenListener = getTreatmentsAccessTokenInjector();
}
