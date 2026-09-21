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
      giftEyebrow: 'string',
      giftTitle: 'string',
      giftCopyLead: 'string',
      giftCopyRest: 'string',
      giftButtonLabel: 'string',
      giftCardUrl: 'string',
      visitEyebrow: 'string',
      visitTitle: 'string',
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
      policyEyebrow: 'string',
      policyTitle: 'string',
      policyCopy: 'string',
      policyFullUrl: 'string',
      policyFullLabel: 'string',
    },
  },
);

export default StudioSectionsElement;
