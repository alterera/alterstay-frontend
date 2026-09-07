export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  city: string;
  stayDate: string;
};

export const testimonialsConfig = {
  title: "What our guests say",
  items: [
    {
      id: "priya-guwahati",
      quote:
        "Booking was effortless and the stay felt exactly like the photos. Alterstay support checked in before arrival — that alone made the trip stress-free.",
      name: "Priya Sharma",
      city: "Guwahati",
      stayDate: "12 May",
    },
    {
      id: "arjun-kolkata",
      quote:
        "Clean rooms, fair pricing, and a smooth check-in. I found a great hotel in minutes and would happily book through Alterstay again.",
      name: "Arjun Mehta",
      city: "Kolkata",
      stayDate: "28 June",
    },
    {
      id: "neha-goa",
      quote:
        "We needed a last-minute weekend stay in Goa. Alterstay made it simple — clear rates, quick confirmation, and a lovely property.",
      name: "Neha Kapoor",
      city: "Goa",
      stayDate: "3 Sep",
    },
    {
      id: "rahul-mumbai",
      quote:
        "Transparent pricing and reliable listings. No surprises at the hotel, and the coins from my membership made the stay even better.",
      name: "Rahul Desai",
      city: "Mumbai",
      stayDate: "19 Aug",
    },
    {
      id: "ananya-jaipur",
      quote:
        "The property matched what we saw online and the booking flow was refreshingly straightforward. Highly recommended for family trips.",
      name: "Ananya Singh",
      city: "Jaipur",
      stayDate: "7 July",
    },
    {
      id: "vikram-delhi",
      quote:
        "Alterstay helped me lock a business stay quickly. Support was responsive and the hotel was exactly what I needed near my meetings.",
      name: "Vikram Rao",
      city: "Delhi",
      stayDate: "22 Apr",
    },
  ] satisfies Testimonial[],
} as const;
