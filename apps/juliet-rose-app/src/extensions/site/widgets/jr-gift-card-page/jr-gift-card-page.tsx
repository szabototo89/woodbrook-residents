import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { GiftCardPage } from './GiftCardPage';

const GiftCardPageElement = reactToWebComponent(GiftCardPage, React, ReactDOM, {
  props: {
    checkoutUrl: 'string',
    imageUrl: 'string',
    imageAlt: 'string',
    phoneHref: 'string',
    phoneLabel: 'string',
    emailHref: 'string',
    emailLabel: 'string',
  },
});

export default GiftCardPageElement;
