import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { HomePageWidget } from './HomePageWidget';

const HomePageElement = reactToWebComponent(HomePageWidget, React, ReactDOM, {
  props: {
    viewMode: 'string',
    bookingBaseUrl: 'string',
    treatmentsUrl: 'string',
    giftCardUrl: 'string',
    featuredSlugs: 'string',
    phoneHref: 'string',
    emailHref: 'string',
    studioImageUrl: 'string',
    heroImageUrl: 'string',
  },
});

export default HomePageElement;
