import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';

import { VisitUs } from './VisitUs';
import {
  CONTACT_DETAILS_DEFAULTS,
  mergeContactLink,
  toEmailHref,
  toPhoneHref,
  type ContactDetails,
} from '../../contactDetails/contactDetails';
import { getContactDetailsAccessTokenInjector } from '../../contactDetails/contactDetailsServices';
import { useContactDetails } from '../../contactDetails/useContactDetails';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
  type HomeContent,
} from '../../homeContent/homeContent';
import {
  combineAccessTokenInjectors,
  getHomeContentAccessTokenInjector,
} from '../../homeContent/homeContentServices';
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
  fetchHomeContent?: () => Promise<HomeContent>;
  fetchContactDetails?: () => Promise<ContactDetails>;
}) {
  const viewMode = useWixViewMode(props.viewMode);
  const content = useHomeContent(viewMode, props.fetchHomeContent);
  const contact = useContactDetails(viewMode, props.fetchContactDetails);
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
      phoneHref={mergeContactLink(
        props.phoneHref,
        contact?.phone,
        toPhoneHref,
        CONTACT_DETAILS_DEFAULTS.phone,
      )}
      phoneLabel={mergeText(
        props.phoneLabel,
        contact?.phone,
        CONTACT_DETAILS_DEFAULTS.phone,
      )}
      emailHref={mergeContactLink(
        props.emailHref,
        contact?.email,
        toEmailHref,
        CONTACT_DETAILS_DEFAULTS.email,
      )}
      emailLabel={mergeText(
        props.emailLabel,
        contact?.email,
        CONTACT_DETAILS_DEFAULTS.email,
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
  accessTokenListener = combineAccessTokenInjectors(
    getHomeContentAccessTokenInjector(),
    getContactDetailsAccessTokenInjector(),
  );
}
