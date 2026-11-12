export function isContentDate(value: string): boolean {
  return value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

// Empty text represents an unavailable date without inventing a factual date.
export function normalizeContentDate(value: unknown): string {
  const text = typeof value === 'string' ? value.trim() : '';
  return isContentDate(text) ? text : '';
}

export function compareContentDates(
  left: string,
  right: string,
  direction: 'oldest' | 'newest' = 'newest',
): number {
  const leftKnown = isContentDate(left);
  const rightKnown = isContentDate(right);
  if (!leftKnown || !rightKnown) {
    return Number(rightKnown) - Number(leftKnown);
  }
  const difference = Date.parse(left) - Date.parse(right);
  return direction === 'oldest' ? difference : -difference;
}
