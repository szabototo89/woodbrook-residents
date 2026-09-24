import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { HomePageWidget } from './HomePageWidget';
import { getBookingPolicyAccessTokenInjector } from '../../bookingPolicy/bookingPolicyServices';
import { getContactDetailsAccessTokenInjector } from '../../contactDetails/contactDetailsServices';
import {
  combineAccessTokenInjectors,
  getHomeContentAccessTokenInjector,
} from '../../homeContent/homeContentServices';
import { getTreatmentsAccessTokenInjector } from '../../treatments/treatmentsServices';

const HomePageElement = reactToWebComponent(HomePageWidget, React, ReactDOM, {
  props: {
    viewMode: 'string',
    bookingBaseUrl: 'string',
    treatmentsUrl: 'string',
    giftCardUrl: 'string',
    featuredSlugs: 'string',
    phoneHref: 'string',
    emailHref: 'string',
    studioImageUrl: 'string',
    heroImageUrl: 'string',
  },
});

export default class AuthenticatedHomePageElement extends HomePageElement {
  accessTokenListener = combineAccessTokenInjectors(
    getTreatmentsAccessTokenInjector(),
    getHomeContentAccessTokenInjector(),
    getContactDetailsAccessTokenInjector(),
    getBookingPolicyAccessTokenInjector(),
  );
}
