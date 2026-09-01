import { ROUTES } from "@/constants/routes";

export type CityItem = {
  id: string;
  name: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type CitiesConfig = {
  title: string;
  items: CityItem[];
  allCities: {
    name: string;
    href: string;
  };
};

export const citiesConfig: CitiesConfig = {
  title: "Popular Cities",
  allCities: {
    name: "All Cities",
    href: ROUTES.cities,
  },
  items: [
    {
      id: "mumbai",
      name: "Mumbai",
      href: `${ROUTES.search}?city=Mumbai`,
      image:
        "/cities/mumbai.webp",
      imageAlt: "Mumbai city skyline",
    },
    {
      id: "delhi",
      name: "Delhi",
      href: `${ROUTES.search}?city=Delhi`,
      image:
        "/cities/delhi.webp",
      imageAlt: "India Gate in Delhi",
    },
    {
      id: "bangalore",
      name: "Bangalore",
      href: `${ROUTES.search}?city=Bangalore`,
      image:
        "/cities/banglore.webp",
      imageAlt: "Bangalore city view",
    },
    {
      id: "hyderabad",
      name: "Hyderabad",
      href: `${ROUTES.search}?city=Hyderabad`,
      image:
        "/cities/hydrabad.webp",
      imageAlt: "Charminar in Hyderabad",
    },
    {
      id: "kolkata",
      name: "Kolkata", 
      href: `${ROUTES.search}?city=Kolkata`,
      image:
        "/cities/kolkata.webp",
      imageAlt: "Victoria Memorial in Kolkata",
    },
    {
      id: "pune",
      name: "Pune",
      href: `${ROUTES.search}?city=Pune`,
      image:
        "/cities/pune.webp",
      imageAlt: "Hills near Pune",
    },
    {
      id: "lucknow",
      name: "Lucknow",
      href: `${ROUTES.search}?city=Lucknow`,
      image:
        "/cities/lucknow.webp",
      imageAlt: "Historic architecture in Lucknow",
    },
  ],
};
