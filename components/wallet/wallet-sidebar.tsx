import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ROUTES } from "@/constants/routes";

const WALLET_FAQS = [
  {
    id: "what-are-coins",
    question: "What are Alter Coins?",
    answer:
      "Alter Coins are rewards you earn after completing eligible stays. 1 coin equals ₹1 and can be applied at checkout to reduce your payable amount.",
  },
  {
    id: "how-to-earn",
    question: "How do I earn coins?",
    answer:
      "Active AlterStay members earn 5–10% back in coins on the room base price after their stay is marked completed.",
  },
  {
    id: "when-credited",
    question: "When are coins credited?",
    answer:
      "Coins are added to your wallet after check-out, once your booking status changes to completed.",
  },
  {
    id: "expiry",
    question: "Do coins expire?",
    answer:
      "Coins in your wallet do not expire for now. You can use them on your next eligible booking.",
  },
] as const;

export function WalletSidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-md border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Ready for your next stay?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Book and stay with us to earn more credits!
        </p>
        <Button render={<Link href={ROUTES.search} />} className="mt-5 w-full">
          Book Now
        </Button>
      </div>

      <div className="rounded-md border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">FAQs</h2>
        <Accordion className="mt-2 w-full">
          {WALLET_FAQS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
}
