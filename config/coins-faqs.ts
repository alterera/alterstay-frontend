import type { FaqItem } from "@/config/faqs";

export const coinsFaqs: FaqItem[] = [
  {
    id: "what-are-coins",
    question: "What are Alterstay coins?",
    answer:
      "Alterstay coins are rewards you earn on eligible completed stays. They appear in your wallet and can be applied on future bookings when redemption is enabled at checkout.",
  },
  {
    id: "earn-coins",
    question: "When do I earn coins?",
    answer:
      "Coins are credited after a stay is completed, based on your membership tier and the booking amount. Pending stays do not earn coins until checkout is complete.",
  },
  {
    id: "redeem-coins",
    question: "How do I redeem coins?",
    answer:
      "During checkout, adjust the coins slider if your booking supports redemption. The payable amount updates instantly before you pay.",
  },
  {
    id: "coins-expiry",
    question: "Do coins expire?",
    answer:
      "Coin balances and expiry rules are shown in your wallet. Active membership plans may include extended validity—check your wallet for the latest balance details.",
  },
];
