import { BookingPolicy } from '../jr-booking-policy/BookingPolicy';
import { GiftCard } from '../jr-gift-card/GiftCard';
import { VisitUs } from '../jr-visit-us/VisitUs';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
  type HomeContent,
} from '../../homeContent/homeContent';

export type StudioSectionsProps = Readonly<{
  giftCardUrl?: string;
  phoneHref?: string;
  phoneLabel?: string;
  emailHref?: string;
  emailLabel?: string;
  studioImageUrl?: string;
  studioImageAlt?: string;
  policyUrl?: string;
  homeContent?: HomeContent | null;
  giftEyebrow?: string;
  giftTitle?: string;
  giftCopyLead?: string;
  giftCopyRest?: string;
  giftButtonLabel?: string;
  visitEyebrow?: string;
  visitTitle?: string;
  visitAddress?: string;
  visitHoursDays?: string;
  visitHoursTime?: string;
  visitContactButtonLabel?: string;
  policyEyebrow?: string;
  policyTitle?: string;
  policyCopy?: string;
  policyFullLabel?: string;
}>;

function pick(
  explicit: string | undefined,
  cmsValue: string | null | undefined,
  fallback: string,
): string {
  return mergeText(explicit, cmsValue, fallback);
}

export function StudioSections(props: StudioSectionsProps) {
  const content = props.homeContent ?? null;
  return (
    <div>
      <GiftCard
        cardUrl={props.giftCardUrl}
        eyebrow={pick(
          props.giftEyebrow,
          content?.giftEyebrow,
          HOME_CONTENT_DEFAULTS.giftEyebrow,
        )}
        title={pick(
          props.giftTitle,
          content?.giftTitle,
          HOME_CONTENT_DEFAULTS.giftTitle,
        )}
        copyLead={pick(
          props.giftCopyLead,
          content?.giftCopyLead,
          HOME_CONTENT_DEFAULTS.giftCopyLead,
        )}
        copyRest={pick(
          props.giftCopyRest,
          content?.giftCopyRest,
          HOME_CONTENT_DEFAULTS.giftCopyRest,
        )}
        buttonLabel={pick(
          props.giftButtonLabel,
          content?.giftButtonLabel,
          HOME_CONTENT_DEFAULTS.giftButtonLabel,
        )}
      />
      <VisitUs
        phoneHref={props.phoneHref}
        phoneLabel={pick(
          props.phoneLabel,
          content?.visitPhoneLabel,
          HOME_CONTENT_DEFAULTS.visitPhoneLabel,
        )}
        emailHref={props.emailHref}
        emailLabel={pick(
          props.emailLabel,
          content?.visitEmailLabel,
          HOME_CONTENT_DEFAULTS.visitEmailLabel,
        )}
        studioImageUrl={props.studioImageUrl}
        studioImageAlt={pick(
          props.studioImageAlt,
          content?.visitStudioImageAlt,
          HOME_CONTENT_DEFAULTS.visitStudioImageAlt,
        )}
        eyebrow={pick(
          props.visitEyebrow,
          content?.visitEyebrow,
          HOME_CONTENT_DEFAULTS.visitEyebrow,
        )}
        title={pick(
          props.visitTitle,
          content?.visitTitle,
          HOME_CONTENT_DEFAULTS.visitTitle,
        )}
        address={pick(
          props.visitAddress,
          content?.visitAddress,
          HOME_CONTENT_DEFAULTS.visitAddress,
        )}
        hoursDays={pick(
          props.visitHoursDays,
          content?.visitHoursDays,
          HOME_CONTENT_DEFAULTS.visitHoursDays,
        )}
        hoursTime={pick(
          props.visitHoursTime,
          content?.visitHoursTime,
          HOME_CONTENT_DEFAULTS.visitHoursTime,
        )}
        contactButtonLabel={pick(
          props.visitContactButtonLabel,
          content?.visitContactButtonLabel,
          HOME_CONTENT_DEFAULTS.visitContactButtonLabel,
        )}
      />
      <BookingPolicy
        fullUrl={props.policyUrl}
        eyebrow={pick(
          props.policyEyebrow,
          content?.policyEyebrow,
          HOME_CONTENT_DEFAULTS.policyEyebrow,
        )}
        title={pick(
          props.policyTitle,
          content?.policyTitle,
          HOME_CONTENT_DEFAULTS.policyTitle,
        )}
        copy={pick(
          props.policyCopy,
          content?.policyCopy,
          HOME_CONTENT_DEFAULTS.policyCopy,
        )}
        fullLabel={pick(
          props.policyFullLabel,
          content?.policyFullLabel,
          HOME_CONTENT_DEFAULTS.policyFullLabel,
        )}
      />
    </div>
  );
}
