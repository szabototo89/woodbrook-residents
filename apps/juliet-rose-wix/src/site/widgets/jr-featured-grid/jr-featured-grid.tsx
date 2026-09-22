import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { FeaturedGridWidget } from './FeaturedGridWidget';

const JrFeaturedGridElement = reactToWebComponent(
  FeaturedGridWidget,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      featuredSlugs: 'string',
      bookingBaseUrl: 'string',
      viewAllLabel: 'string',
      viewAllHref: 'string',
    },
  },
);

export default JrFeaturedGridElement;
