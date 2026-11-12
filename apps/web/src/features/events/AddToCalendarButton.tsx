import type { MouseEvent } from 'react';
import { useCallback } from 'react';
import { CalendarPlus } from 'lucide-react';

import type { CommunityEvent } from '../content/contentTypes';
import { resolveSiteUrl } from '../../app/siteMetadata';
import { buildAddToCalendarConfig } from './addToCalendarConfig';
import { isContentDate } from '../content/contentDates';

type AddToCalendarButtonProps = {
  event: CommunityEvent;
};

export function AddToCalendarButton(props: AddToCalendarButtonProps) {
  const handleClick = useCallback(
    (clicked: MouseEvent<HTMLButtonElement>) => {
      const trigger = clicked.currentTarget;
      const siteUrl = resolveSiteUrl(import.meta.env);
      void import('add-to-calendar-button').then(({ atcb_action }) =>
        atcb_action(
          buildAddToCalendarConfig(props.event, siteUrl, navigator.userAgent),
          trigger,
        ),
      );
    },
    [props.event],
  );

  if (!isContentDate(props.event.startsAt)) return null;

  return (
    <button
      type="button"
      className="button button-secondary"
      onClick={handleClick}
    >
      Add to calendar
      <CalendarPlus size={17} aria-hidden="true" />
    </button>
  );
}
