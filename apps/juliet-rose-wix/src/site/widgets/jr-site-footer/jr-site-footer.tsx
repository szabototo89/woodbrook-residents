import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { SiteFooter } from './SiteFooter';

const SiteFooterElement = reactToWebComponent(SiteFooter, React, ReactDOM, {
  props: {
    brandTitle: 'string',
    brandSubtitle: 'string',
    homeUrl: 'string',
    treatmentsUrl: 'string',
    giftCardsUrl: 'string',
    contactUrl: 'string',
    instagramUrl: 'string',
    tagline: 'string',
    copyright: 'string',
  },
});

export default SiteFooterElement;
