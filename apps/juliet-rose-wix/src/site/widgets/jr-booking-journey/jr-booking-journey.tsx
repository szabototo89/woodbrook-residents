import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import {
  JrBookingJourney,
  type BookingJourneyViewMode,
} from './JrBookingJourney';

const JrBookingJourneyElement = reactToWebComponent(
  JrBookingJourney,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      initialService: 'string',
      today: 'string',
    },
  },
);

export default JrBookingJourneyElement;
export type { BookingJourneyViewMode };
