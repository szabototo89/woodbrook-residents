import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { BookingPolicy } from './BookingPolicy';

const JrBookingPolicyElement = reactToWebComponent(
  BookingPolicy,
  React,
  ReactDOM,
  {
    props: {
      eyebrow: 'string',
      title: 'string',
      copy: 'string',
      fullUrl: 'string',
      fullLabel: 'string',
    },
  },
);

export default JrBookingPolicyElement;
