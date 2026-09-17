const menuButton = document.querySelector('.menu-button');
const mobileNavigation = document.querySelector('.mobile-navigation');
const mobileBooking = document.querySelector('.mobile-booking');
const hero = document.querySelector('.hero');
let previousScrollY = window.scrollY;
let bookingIdleTimer;

function setMobileBookingVisible(isVisible) {
  mobileBooking?.classList.toggle('is-visible', isVisible);
  mobileBooking?.setAttribute('aria-hidden', String(!isVisible));
  if (isVisible) {
    mobileBooking?.removeAttribute('tabindex');
  } else {
    mobileBooking?.setAttribute('tabindex', '-1');
  }
}

function updateMobileBooking() {
  window.clearTimeout(bookingIdleTimer);
  const currentScrollY = Math.max(window.scrollY, 0);
  const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
  const isEligibleViewport = window.matchMedia(
    '(max-width: 900px) and (min-height: 601px) and (orientation: portrait)',
  ).matches;
  const isPastHero = currentScrollY > heroBottom;
  const scrollDelta = currentScrollY - previousScrollY;

  if (
    !isEligibleViewport ||
    !isPastHero ||
    document.body.classList.contains('menu-open')
  ) {
    setMobileBookingVisible(false);
  } else if (scrollDelta < -4) {
    setMobileBookingVisible(true);
  } else if (scrollDelta > 4) {
    setMobileBookingVisible(false);
  }

  if (
    isEligibleViewport &&
    isPastHero &&
    !document.body.classList.contains('menu-open')
  ) {
    const settledScrollY = currentScrollY;
    bookingIdleTimer = window.setTimeout(() => {
      if (
        Math.abs(window.scrollY - settledScrollY) < 2 &&
        !document.body.classList.contains('menu-open')
      ) {
        setMobileBookingVisible(true);
      }
    }, 650);
  }

  previousScrollY = currentScrollY;
}

function setMenuOpen(isOpen) {
  menuButton?.setAttribute('aria-expanded', String(isOpen));
  menuButton?.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  mobileNavigation?.toggleAttribute('hidden', !isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  if (isOpen) {
    window.clearTimeout(bookingIdleTimer);
    setMobileBookingVisible(false);
  }
}

menuButton?.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileNavigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMenuOpen(false);
  updateMobileBooking();
});

window.addEventListener('scroll', updateMobileBooking, {
  passive: true,
});

setMobileBookingVisible(false);
