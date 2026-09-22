import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { type BookingJourneyViewMode } from './BookingJourney';
import { BookingJourneyWidget } from './BookingJourneyWidget';

const BookingJourneyElement = reactToWebComponent(
  BookingJourneyWidget,
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
