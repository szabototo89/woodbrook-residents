const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
}

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menu?.classList.toggle('open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

menu?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu({ restoreFocus: true });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 840) closeMenu();
});

const notes = document.querySelector('[data-notes]');
const notesToggle = document.querySelector('[data-notes-toggle]');
const notesClose = document.querySelector('[data-notes-close]');

notesToggle?.addEventListener('click', () => {
  notes?.removeAttribute('hidden');
  notesClose?.focus();
});

notesClose?.addEventListener('click', () => {
  notes?.setAttribute('hidden', '');
  notesToggle?.focus();
});

notes?.addEventListener('click', (event) => {
  if (event.target === notes) notesClose?.click();
});

const accordionItems = document.querySelectorAll('[data-accordion] details');
accordionItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    accordionItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.removeAttribute('open');
    });
  });
});

const appointmentForm = document.querySelector('[data-appointment-form]');
const successMessage = document.querySelector('[data-form-success]');

appointmentForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage?.removeAttribute('hidden');
  successMessage?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
