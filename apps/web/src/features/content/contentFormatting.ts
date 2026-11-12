import { isContentDate } from './contentDates';

export function formatDate(value: string) {
  if (!isContentDate(value)) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Dublin',
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  if (!isContentDate(value)) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-IE', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Dublin',
  }).format(new Date(value));
}

export function formatLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
