import { BookingPolicy } from '../jr-booking-policy/BookingPolicy';
import { GiftCard } from '../jr-gift-card/GiftCard';
import { VisitUs } from '../jr-visit-us/VisitUs';

export type StudioSectionsProps = Readonly<{
  giftCardUrl?: string;
  phoneHref?: string;
  phoneLabel?: string;
  emailHref?: string;
  emailLabel?: string;
  studioImageUrl?: string;
  studioImageAlt?: string;
  policyUrl?: string;
}>;

export function StudioSections(props: StudioSectionsProps) {
  return (
    <div>
      <GiftCard cardUrl={props.giftCardUrl} />
      <VisitUs
        phoneHref={props.phoneHref}
        phoneLabel={props.phoneLabel}
        emailHref={props.emailHref}
        emailLabel={props.emailLabel}
        studioImageUrl={props.studioImageUrl}
        studioImageAlt={props.studioImageAlt}
      />
      <BookingPolicy fullUrl={props.policyUrl} />
    </div>
  );
}
