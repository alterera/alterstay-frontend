export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type GuestCounts = {
  rooms: number;
  adults: number;
  children: number;
};

export type PropertySearchParams = {
  city: string;
  dateRange: DateRange;
  guests: GuestCounts;
};

export const DEFAULT_GUEST_COUNTS: GuestCounts = {
  rooms: 1,
  adults: 2,
  children: 0,
};

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function createDefaultSearchParams(): PropertySearchParams {
  const from = startOfToday();
  const to = addDays(from, 1);

  return {
    city: "Mumbai",
    dateRange: { from, to },
    guests: {
      rooms: 1,
      adults: 2,
      children: 0,
    },
  };
}
