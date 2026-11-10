const isCurrent = (dateStr?: string) =>
  !dateStr || dateStr.toLowerCase() === 'current';

export const toFormatDateWithMonth = (dateStr?: string) => {
  if (isCurrent(dateStr)) {
    return 'Present';
  }
  const date = new Date(dateStr as string);
  // Pin to UTC so server and client render the same month.
  const ye = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  const mo = new Intl.DateTimeFormat('en', {
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
  return `${mo} ${ye}`;
};

/** Whole years elapsed from `dateStr` (e.g. "2018-09") until now. */
export const yearsSince = (dateStr: string, now: Date = new Date()) => {
  const start = new Date(dateStr);
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  if (now.getUTCMonth() < start.getUTCMonth()) years -= 1;
  return Math.max(years, 0);
};
