import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { VisitUs } from './VisitUs';

const JrVisitUsElement = reactToWebComponent(VisitUs, React, ReactDOM, {
  props: {
    eyebrow: 'string',
    title: 'string',
    address: 'string',
    hoursDays: 'string',
    hoursTime: 'string',
    phoneHref: 'string',
    phoneLabel: 'string',
    emailHref: 'string',
    emailLabel: 'string',
    contactButtonLabel: 'string',
    studioImageUrl: 'string',
    studioImageAlt: 'string',
  },
});

export default JrVisitUsElement;
