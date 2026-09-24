import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { GiftCard } from './GiftCard';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
} from '../../homeContent/homeContent';
import { getHomeContentAccessTokenInjector } from '../../homeContent/homeContentServices';
import { useHomeContent } from '../../homeContent/useHomeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveGiftCard(props: {
  viewMode?: ServicesViewMode;
  eyebrow?: string;
  title?: string;
  copyLead?: string;
  copyRest?: string;
  buttonLabel?: string;
  cardUrl?: string;
}) {
  const viewMode = useWixViewMode(props.viewMode);
  const content = useHomeContent(viewMode);
  return (
    <GiftCard
      eyebrow={mergeText(
        props.eyebrow,
        content?.giftEyebrow,
        HOME_CONTENT_DEFAULTS.giftEyebrow,
      )}
      title={mergeText(
        props.title,
        content?.giftTitle,
        HOME_CONTENT_DEFAULTS.giftTitle,
      )}
      copyLead={mergeText(
        props.copyLead,
        content?.giftCopyLead,
        HOME_CONTENT_DEFAULTS.giftCopyLead,
      )}
      copyRest={mergeText(
        props.copyRest,
        content?.giftCopyRest,
        HOME_CONTENT_DEFAULTS.giftCopyRest,
      )}
      buttonLabel={mergeText(
        props.buttonLabel,
        content?.giftButtonLabel,
        HOME_CONTENT_DEFAULTS.giftButtonLabel,
      )}
      cardUrl={props.cardUrl}
    />
  );
}

const JrGiftCardElement = reactToWebComponent(LiveGiftCard, React, ReactDOM, {
  props: {
    viewMode: 'string',
    eyebrow: 'string',
    title: 'string',
    copyLead: 'string',
    copyRest: 'string',
    buttonLabel: 'string',
    cardUrl: 'string',
  },
});

export default class AuthenticatedGiftCardElement extends JrGiftCardElement {
  accessTokenListener = getHomeContentAccessTokenInjector();
}
