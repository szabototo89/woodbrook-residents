import { BookingPolicy } from './BookingPolicy';

// The policy section is hidden by default (`display: none` until
// `#booking-policy` is `:target`). Cosmos previews each fixture without a URL
// hash, so without this fixture-scoped override the preview is blank.
// `section[id=...]` plus `!important` beats both `.policy` and
// `.policy:target` without touching production styles or the Cosmos URL.
export default (
  <>
    <style>{'section[id="booking-policy"]{display:grid !important}'}</style>
    <BookingPolicy />
  </>
);
