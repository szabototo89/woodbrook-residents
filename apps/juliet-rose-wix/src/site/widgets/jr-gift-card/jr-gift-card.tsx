import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { GiftCard } from './GiftCard';

const JrGiftCardElement = reactToWebComponent(GiftCard, React, ReactDOM, {
  props: {
    eyebrow: 'string',
    title: 'string',
    copyLead: 'string',
    copyRest: 'string',
    buttonLabel: 'string',
    cardUrl: 'string',
  },
});

export default JrGiftCardElement;
