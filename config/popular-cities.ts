/**
 * Popular Indian cities for destination search.
 * Replace with API-driven results when the locations endpoint is ready.
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
