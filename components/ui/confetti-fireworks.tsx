"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type ConfettiFireworksProps = {
  active?: boolean;
  durationMs?: number;
};

export function ConfettiFireworks({
  active = true,
  durationMs = 5 * 1000,
}: ConfettiFireworksProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    firedRef.current = true;

    const animationEnd = Date.now() + durationMs;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / durationMs);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [active, durationMs]);

  return null;
}
