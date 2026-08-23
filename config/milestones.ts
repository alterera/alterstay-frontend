export type MilestoneStat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  description: string;
  duration?: number;
  delay?: number;
};

export const milestonesConfig = {
  title: "Our Milestone",
  subtitle:
    "Trusted stays, growing destinations, and guests who keep coming back.",
  stats: [
    {
      id: "years",
      label: "Hospitality excellence",
      value: 10,
      suffix: "+",
      description: "Amazing Years",
      duration: 1.4,
      delay: 0,
    },
    {
      id: "countries",
      label: "Global reach",
      value: 8,
      description: "Countries",
      duration: 1.2,
      delay: 0.15,
    },
    {
      id: "guests",
      label: "Guest love",
      value: 24,
      suffix: "M+",
      description: "Happy Guests",
      duration: 1.6,
      delay: 0.3,
    },
  ] satisfies MilestoneStat[],
} as const;
