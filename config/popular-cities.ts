/**
 * Popular Indian city names for static copy (e.g. FAQs).
 * The search picker loads suggestions from GET /search/cities?q=&limit=.
 */
export const popularIndianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Goa",
  "Kochi",
  "Indore",
  "Guwahati",
  "Noida",
  "Gurgaon",
  "Udaipur",
  "Varanasi",
  "Shimla",
] as const;

export type PopularCity = (typeof popularIndianCities)[number];
