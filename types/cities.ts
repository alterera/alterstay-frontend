export type CitySuggestion = {
  name: string;
  slug: string;
  state: string | null;
};

export type CityListItem = CitySuggestion & {
  propertyCount: number;
  minPriceFrom: number | null;
  currency: string;
};
