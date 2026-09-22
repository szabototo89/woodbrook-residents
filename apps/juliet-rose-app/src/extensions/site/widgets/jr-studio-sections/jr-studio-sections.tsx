import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { StudioSections } from './StudioSections';

const StudioSectionsElement = reactToWebComponent(
  StudioSections,
  React,
  ReactDOM,
  {
    props: {
      giftCardUrl: 'string',
      phoneHref: 'string',
      phoneLabel: 'string',
      emailHref: 'string',
      emailLabel: 'string',
      studioImageUrl: 'string',
      studioImageAlt: 'string',
      policyUrl: 'string',
    },
  },
);

export default StudioSectionsElement;
