import { useEffect, type ReactNode } from 'react';

import { BookingPolicy } from './BookingPolicy';

function RevealOnMount(props: Readonly<{ children: ReactNode }>) {
  useEffect(() => {
    if (window.location.hash !== '#booking-policy') {
      window.location.hash = 'booking-policy';
    }
  }, []);

  return <>{props.children}</>;
}

export default (
  <RevealOnMount>
    <BookingPolicy />
  </RevealOnMount>
);
