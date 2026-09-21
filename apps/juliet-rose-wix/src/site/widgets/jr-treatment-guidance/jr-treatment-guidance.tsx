import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { TreatmentGuidance } from './TreatmentGuidance';

const JrTreatmentGuidanceElement = reactToWebComponent(
  TreatmentGuidance,
  React,
  ReactDOM,
  {
    props: {
      contactUrl: 'string',
    },
  },
);

export default JrTreatmentGuidanceElement;
