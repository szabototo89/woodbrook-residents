import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { GiftCardPage } from './GiftCardPage';
import { getContactDetailsAccessTokenInjector } from '../../contactDetails/contactDetailsServices';
import { useContactDetails } from '../../contactDetails/useContactDetails';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveGiftCardPage(
  props: React.ComponentProps<typeof GiftCardPage> & {
    viewMode?: ServicesViewMode;
  },
) {
  const viewMode = useWixViewMode(props.viewMode);
  const contact = useContactDetails(viewMode);
  return <GiftCardPage {...props} contact={contact} />;
}

const GiftCardPageElement = reactToWebComponent(
  LiveGiftCardPage,
  React,
  ReactDOM,
  {
    props: {
      viewMode: 'string',
      checkoutUrl: 'string',
      imageUrl: 'string',
      imageAlt: 'string',
      phoneHref: 'string',
      phoneLabel: 'string',
      emailHref: 'string',
      emailLabel: 'string',
    },
  },
);

export default class AuthenticatedGiftCardPageElement extends GiftCardPageElement {
  accessTokenListener = getContactDetailsAccessTokenInjector();
}
