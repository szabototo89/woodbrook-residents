import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { BookingJourney, type BookingJourneyViewMode } from './BookingJourney';

const BookingJourneyElement = reactToWebComponent(
  BookingJourney,
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

export default BookingJourneyElement;
export type { BookingJourneyViewMode };
