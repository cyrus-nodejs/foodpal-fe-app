export const parseDate = (iso?: string | null): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d; // avoid invalid date errors
};

export const daysAgo = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

export const isOnOrAfter = (a: Date | null, b: Date): boolean => {
  if (!a) return false;
  return a.getTime() >= b.getTime();
};