import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { SiteHeader } from './SiteHeader';

const SiteHeaderElement = reactToWebComponent(SiteHeader, React, ReactDOM, {
  props: {
    activeNavigationItem: 'string',
    brandTitle: 'string',
    brandSubtitle: 'string',
    homeUrl: 'string',
    treatmentsUrl: 'string',
    giftCardsUrl: 'string',
    contactUrl: 'string',
    bookingUrl: 'string',
    bookingLabel: 'string',
  },
});

export default SiteHeaderElement;
