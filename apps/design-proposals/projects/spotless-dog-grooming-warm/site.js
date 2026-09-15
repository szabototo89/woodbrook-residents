const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu?.classList.toggle('open', open);
});
menu?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
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

const form = document.querySelector('[data-appointment-form]');
const success = document.querySelector('[data-form-success]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  success?.removeAttribute('hidden');
});
