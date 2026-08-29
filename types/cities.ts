export type CityListItem = {
  name: string;
  slug: string;
  state: string | null;
  propertyCount: number;
  minPriceFrom: number | null;
  currency: string;
};
