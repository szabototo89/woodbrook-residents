import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { BookingPolicy } from './BookingPolicy';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
} from '../../homeContent/homeContent';
import { getHomeContentAccessTokenInjector } from '../../homeContent/homeContentServices';
import { useHomeContent } from '../../homeContent/useHomeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveBookingPolicy(props: {
  viewMode?: ServicesViewMode;
  eyebrow?: string;
  title?: string;
  copy?: string;
  fullUrl?: string;
  fullLabel?: string;
}) {
  const viewMode = useWixViewMode(props.viewMode);
  const content = useHomeContent(viewMode);
  return (
    <BookingPolicy
      eyebrow={mergeText(
        props.eyebrow,
        content?.policyEyebrow,
        HOME_CONTENT_DEFAULTS.policyEyebrow,
      )}
      title={mergeText(
        props.title,
        content?.policyTitle,
        HOME_CONTENT_DEFAULTS.policyTitle,
      )}
      copy={mergeText(
        props.copy,
        content?.policyCopy,
        HOME_CONTENT_DEFAULTS.policyCopy,
      )}
      fullUrl={props.fullUrl}
      fullLabel={mergeText(
        props.fullLabel,
        content?.policyFullLabel,
        HOME_CONTENT_DEFAULTS.policyFullLabel,
      )}
    />
  );
}

const JrBookingPolicyElement = reactToWebComponent(
  LiveBookingPolicy,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      eyebrow: 'string',
      title: 'string',
      copy: 'string',
      fullUrl: 'string',
      fullLabel: 'string',
    },
  },
);

export default class AuthenticatedBookingPolicyElement extends JrBookingPolicyElement {
  accessTokenListener = getHomeContentAccessTokenInjector();
}
