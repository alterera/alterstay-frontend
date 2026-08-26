export const siteConfig = {
  name: "AlterStay",
  description:
    "Discover stunning resorts and elegant hotels. Book your perfect stay with expert support.",
  tagline: "Unwind in Stunning Resorts, Stay in Elegant Hotels.",
  subtagline: "Expert support for a smooth and hassle-free booking experience",
  socialProof: {
    label: "124.8K+ Happy Customers",
    remainingCount: "+3",
    avatars: [
      {
        src: "https://github.com/shadcn.png",
        alt: "Happy customer",
        fallback: "CN",
      },
      {
        src: "https://github.com/maxleiter.png",
        alt: "Happy customer",
        fallback: "LR",
      },
      {
        src: "https://github.com/evilrabbit.png",
        alt: "Happy customer",
        fallback: "ER",
      },
    ],
  },
  hero: {
    backgroundImage:
      "/hero-background.webp",
    backgroundAlt: "Tropical resort with palm trees and pool",
  },
} as const;
