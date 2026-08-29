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
        "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=400&auto=format&fit=crop",
      imageAlt: "Mumbai city skyline",
    },
    {
      id: "delhi",
      name: "Delhi",
      href: `${ROUTES.search}?city=Delhi`,
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=400&auto=format&fit=crop",
      imageAlt: "India Gate in Delhi",
    },
    {
      id: "bangalore",
      name: "Bangalore",
      href: `${ROUTES.search}?city=Bangalore`,
      image:
        "https://images.unsplash.com/photo-1596176530525-0288a0fef743?q=80&w=400&auto=format&fit=crop",
      imageAlt: "Bangalore city view",
    },
    {
      id: "hyderabad",
      name: "Hyderabad",
      href: `${ROUTES.search}?city=Hyderabad`,
      image:
        "https://images.unsplash.com/photo-1551161242-b5af797f732b?q=80&w=400&auto=format&fit=crop",
      imageAlt: "Charminar in Hyderabad",
    },
    {
      id: "kolkata",
      name: "Kolkata",
      href: `${ROUTES.search}?city=Kolkata`,
      image:
        "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=400&auto=format&fit=crop",
      imageAlt: "Victoria Memorial in Kolkata",
    },
    {
      id: "pune",
      name: "Pune",
      href: `${ROUTES.search}?city=Pune`,
      image:
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=400&auto=format&fit=crop",
      imageAlt: "Hills near Pune",
    },
    {
      id: "lucknow",
      name: "Lucknow",
      href: `${ROUTES.search}?city=Lucknow`,
      image:
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=400&auto=format&fit=crop",
      imageAlt: "Historic architecture in Lucknow",
    },
  ],
};
