import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { VisitUs } from './VisitUs';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
} from '../../homeContent/homeContent';
import { getHomeContentAccessTokenInjector } from '../../homeContent/homeContentServices';
import { useHomeContent } from '../../homeContent/useHomeContent';
import type { ServicesViewMode } from '../../treatments/useServices';
import { useWixViewMode } from '../../useWixViewMode';

function LiveVisitUs(props: {
  viewMode?: ServicesViewMode;
  eyebrow?: string;
  title?: string;
  address?: string;
  hoursDays?: string;
  hoursTime?: string;
  phoneHref?: string;
  phoneLabel?: string;
  emailHref?: string;
  emailLabel?: string;
  contactButtonLabel?: string;
  studioImageUrl?: string;
  studioImageAlt?: string;
}) {
  const viewMode = useWixViewMode(props.viewMode);
  const content = useHomeContent(viewMode);
  return (
    <VisitUs
      {...props}
      eyebrow={mergeText(
        props.eyebrow,
        content?.visitEyebrow,
        HOME_CONTENT_DEFAULTS.visitEyebrow,
      )}
      title={mergeText(
        props.title,
        content?.visitTitle,
        HOME_CONTENT_DEFAULTS.visitTitle,
      )}
      address={mergeText(
        props.address,
        content?.visitAddress,
        HOME_CONTENT_DEFAULTS.visitAddress,
      )}
      hoursDays={mergeText(
        props.hoursDays,
        content?.visitHoursDays,
        HOME_CONTENT_DEFAULTS.visitHoursDays,
      )}
      hoursTime={mergeText(
        props.hoursTime,
        content?.visitHoursTime,
        HOME_CONTENT_DEFAULTS.visitHoursTime,
      )}
      phoneLabel={mergeText(
        props.phoneLabel,
        content?.visitPhoneLabel,
        HOME_CONTENT_DEFAULTS.visitPhoneLabel,
      )}
      emailLabel={mergeText(
        props.emailLabel,
        content?.visitEmailLabel,
        HOME_CONTENT_DEFAULTS.visitEmailLabel,
      )}
      contactButtonLabel={mergeText(
        props.contactButtonLabel,
        content?.visitContactButtonLabel,
        HOME_CONTENT_DEFAULTS.visitContactButtonLabel,
      )}
      studioImageAlt={mergeText(
        props.studioImageAlt,
        content?.visitStudioImageAlt,
        HOME_CONTENT_DEFAULTS.visitStudioImageAlt,
      )}
    />
  );
}

const JrVisitUsElement = reactToWebComponent(LiveVisitUs, React, ReactDOM, {
  props: {
    viewMode: 'string',
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

export default class AuthenticatedVisitUsElement extends JrVisitUsElement {
  accessTokenListener = getHomeContentAccessTokenInjector();
}
