import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { StudioSections } from './StudioSections';
import { getBookingPolicyAccessTokenInjector } from '../../bookingPolicy/bookingPolicyServices';
import { useBookingPolicy } from '../../bookingPolicy/useBookingPolicy';
import { getContactDetailsAccessTokenInjector } from '../../contactDetails/contactDetailsServices';
import { useContactDetails } from '../../contactDetails/useContactDetails';
import {
  combineAccessTokenInjectors,
  getHomeContentAccessTokenInjector,
} from '../../homeContent/homeContentServices';
import { useHomeContent } from '../../homeContent/useHomeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveStudioSections(
  props: React.ComponentProps<typeof StudioSections> & {
    viewMode?: ServicesViewMode;
  },
) {
  const viewMode = useWixViewMode(props.viewMode);
  const homeContent = useHomeContent(viewMode);
  const contact = useContactDetails(viewMode);
  const policy = useBookingPolicy(viewMode);
  return (
    <StudioSections
      {...props}
      homeContent={homeContent}
      contact={contact}
      policy={policy}
    />
  );
}

const StudioSectionsElement = reactToWebComponent(
  LiveStudioSections,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
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

export default class AuthenticatedStudioSectionsElement extends StudioSectionsElement {
  accessTokenListener = combineAccessTokenInjectors(
    getHomeContentAccessTokenInjector(),
    getContactDetailsAccessTokenInjector(),
    getBookingPolicyAccessTokenInjector(),
  );
}
