/**
 * Alterstays brand palette — keep in sync with app/globals.css CSS variables.
 */
export const colors = {
  brand: "#EC1846",
  brandDark: "#0F172A",
  charcoal: "#111827",
  slateText: "#4B5563",
  premium: "#D4A24C",
  blush: "#FF5C7A",
  coral: "#FF8A65",
  teal: "#22C1A1",
  background: "#F3F4F6",
  surface: "#FFFFFF",
} as const;

export const gradients = {
  hero: "linear-gradient(135deg, #EC1846 0%, #FF5C7A 100%)",
  premium: "linear-gradient(135deg, #EC1846 0%, #0F172A 100%)",
  hospitality: "linear-gradient(135deg, #FF5C7A 0%, #FFD1DA 100%)",
} as const;
