import { format, isAfter, isEqual, isWeekend, startOfDay } from 'date-fns';

const OPENING_MINUTES = 10 * 60;
const CLOSING_MINUTES = 20 * 60;

export function isBookableDate(date: Date, today = new Date()): boolean {
  const candidate = startOfDay(date);
  const currentDay = startOfDay(today);
  return (
    (isAfter(candidate, currentDay) || isEqual(candidate, currentDay)) &&
    !isWeekend(candidate)
  );
}

export function createDailySlots(durationMinutes: number): string[] {
  const slotCount = Math.floor(
    (CLOSING_MINUTES - OPENING_MINUTES) / durationMinutes,
  );
  return Array.from({ length: slotCount }, (_, index) => {
    const start = OPENING_MINUTES + index * durationMinutes;
    const hours = Math.floor(start / 60);
    const minutes = start % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });
}

export function formatBookingDate(date: Date): string {
  return format(date, 'EEEE, d MMMM yyyy');
}
