const dateFormat = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/** "Nov 1, 2026". Dates are formatted in UTC so frontmatter dates don't shift by timezone. */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** ISO date for <time datetime>, e.g. "2026-11-01". */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
