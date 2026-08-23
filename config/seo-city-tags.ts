import { ROUTES } from "@/constants/routes";

export type SeoCityTag = {
  id: string;
  label: string;
  href: string;
};

const cities = [
  "Bangalore",
  "Guwahati",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Goa",
  "Kochi",
  "Ahmedabad",
  "Chandigarh",
  "Indore",
  "Lucknow",
  "Varanasi",
  "Udaipur",
  "Shimla",
  "Manali",
  "Darjeeling",
  "Agra",
  "Nainital",
  "Mysore",
  "Coimbatore",
] as const;

export const seoCityTagsConfig = {
  title: "Popular Hotel Destinations",
  /** Number of tags shown on mobile before "Load more" */
  mobileInitialCount: 10,
  tags: cities.map((city) => ({
    id: city.toLowerCase().replace(/\s+/g, "-"),
    label: `Hotel in ${city}`,
    href: `${ROUTES.search}?city=${encodeURIComponent(city)}`,
  })) satisfies SeoCityTag[],
} as const;
