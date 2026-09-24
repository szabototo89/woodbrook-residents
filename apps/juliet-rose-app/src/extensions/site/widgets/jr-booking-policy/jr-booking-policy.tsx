import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { BookingPolicy } from './BookingPolicy';
import {
  BOOKING_POLICY_DEFAULTS,
  type BookingPolicyContent,
} from '../../bookingPolicy/bookingPolicy';
import { getBookingPolicyAccessTokenInjector } from '../../bookingPolicy/bookingPolicyServices';
import { useBookingPolicy } from '../../bookingPolicy/useBookingPolicy';
import { mergeText } from '../../homeContent/homeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveBookingPolicy(props: {
  viewMode?: ServicesViewMode;
  eyebrow?: string;
  title?: string;
  copy?: string;
  fullUrl?: string;
  fullLabel?: string;
  fetchBookingPolicy?: () => Promise<BookingPolicyContent>;
}) {
  const viewMode = useWixViewMode(props.viewMode);
  const content = useBookingPolicy(viewMode, props.fetchBookingPolicy);
  return (
    <BookingPolicy
      eyebrow={mergeText(
        props.eyebrow,
        content?.eyebrow,
        BOOKING_POLICY_DEFAULTS.eyebrow,
      )}
      title={mergeText(
        props.title,
        content?.title,
        BOOKING_POLICY_DEFAULTS.title,
      )}
      copy={mergeText(props.copy, content?.copy, BOOKING_POLICY_DEFAULTS.copy)}
      fullUrl={mergeText(
        props.fullUrl,
        content?.fullUrl,
        BOOKING_POLICY_DEFAULTS.fullUrl,
      )}
      fullLabel={mergeText(
        props.fullLabel,
        content?.fullLabel,
        BOOKING_POLICY_DEFAULTS.fullLabel,
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
  accessTokenListener = getBookingPolicyAccessTokenInjector();
}
