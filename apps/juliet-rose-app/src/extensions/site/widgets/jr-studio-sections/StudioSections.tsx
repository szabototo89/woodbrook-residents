import { BookingPolicy } from '../jr-booking-policy/BookingPolicy';
import { GiftCard } from '../jr-gift-card/GiftCard';
import { VisitUs } from '../jr-visit-us/VisitUs';
import {
  BOOKING_POLICY_DEFAULTS,
  type BookingPolicyContent,
} from '../../bookingPolicy/bookingPolicy';
import {
  CONTACT_DETAILS_DEFAULTS,
  type ContactDetails,
} from '../../contactDetails/contactDetails';
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
  contact?: ContactDetails | null;
  policy?: BookingPolicyContent | null;
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
  const contact = props.contact ?? null;
  const policy = props.policy ?? null;
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
        phoneHref={pick(
          props.phoneHref,
          contact?.phoneHref,
          CONTACT_DETAILS_DEFAULTS.phoneHref,
        )}
        phoneLabel={pick(
          props.phoneLabel,
          contact?.phoneLabel,
          CONTACT_DETAILS_DEFAULTS.phoneLabel,
        )}
        emailHref={pick(
          props.emailHref,
          contact?.emailHref,
          CONTACT_DETAILS_DEFAULTS.emailHref,
        )}
        emailLabel={pick(
          props.emailLabel,
          contact?.emailLabel,
          CONTACT_DETAILS_DEFAULTS.emailLabel,
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
        fullUrl={pick(
          props.policyUrl,
          policy?.fullUrl,
          BOOKING_POLICY_DEFAULTS.fullUrl,
        )}
        eyebrow={pick(
          props.policyEyebrow,
          policy?.eyebrow,
          BOOKING_POLICY_DEFAULTS.eyebrow,
        )}
        title={pick(
          props.policyTitle,
          policy?.title,
          BOOKING_POLICY_DEFAULTS.title,
        )}
        copy={pick(
          props.policyCopy,
          policy?.copy,
          BOOKING_POLICY_DEFAULTS.copy,
        )}
        fullLabel={pick(
          props.policyFullLabel,
          policy?.fullLabel,
          BOOKING_POLICY_DEFAULTS.fullLabel,
        )}
      />
    </div>
  );
}
