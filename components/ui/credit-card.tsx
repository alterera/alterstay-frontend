"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const PERSPECTIVE = 400;
const CARD_ANIMATION_DURATION = 0.5;
const INITIAL_DELAY = 0.2;

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 30,
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export interface WalletCreditCardProps {
  className?: string;
  holderName: string;
  referralCode?: string | null;
  onCopyReferral?: () => void;
  copied?: boolean;
}

const WalletCreditCard = React.forwardRef<HTMLDivElement, WalletCreditCardProps>(
  (
    {
      className,
      holderName,
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ duration: CARD_ANIMATION_DURATION }}
        style={{ perspective: PERSPECTIVE }}
        className={cn("relative w-full max-w-sm touch-none", className)}
      >
        <motion.div
          className="relative h-48 w-full overflow-hidden rounded-md bg-gradient-premium p-5 text-white shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: CARD_ANIMATION_DURATION }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-6 size-48 rounded-full bg-white/5"
          />

          <div className="relative flex items-start justify-between">
            <motion.div
              className="text-lg font-bold tracking-wide"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: INITIAL_DELAY,
                duration: CARD_ANIMATION_DURATION,
              }}
            >
              ALTERSTAY
            </motion.div>
            <motion.div
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: INITIAL_DELAY, duration: CARD_ANIMATION_DURATION }}
            >
              Wallet
            </motion.div>
          </div>

          <motion.div
            className="relative mt-5 h-8 w-11 rounded-md bg-premium/90 shadow-inner"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, ...springTransition }}
            aria-hidden
          />

          

          <motion.div
            className="absolute bottom-5 left-5 right-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: CARD_ANIMATION_DURATION }}
          >
            <div className="truncate text-lg font-semibold">{holderName}</div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  },
);
WalletCreditCard.displayName = "WalletCreditCard";

export { WalletCreditCard };
