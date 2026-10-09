"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import {
  CheckCircle2Icon,
  Clock3Icon,
  Loader2Icon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type BookingResultTicketVariant =
  | "success"
  | "failed"
  | "warning"
  | "processing"
  | "neutral";

const variantIcon: Record<
  BookingResultTicketVariant,
  React.ComponentType<{ className?: string }>
> = {
  success: CheckCircle2Icon,
  failed: XCircleIcon,
  warning: TriangleAlertIcon,
  processing: Loader2Icon,
  neutral: Clock3Icon,
};

const variantIconWrap: Record<BookingResultTicketVariant, string> = {
  success: "bg-brand/10 text-brand",
  failed: "bg-destructive/10 text-destructive",
  warning: "bg-amber-50 text-amber-700",
  processing: "bg-sky-50 text-sky-700",
  neutral: "bg-muted text-muted-foreground",
};

function DashedLine() {
  return (
    <div
      className="w-full border-t border-dashed border-border"
      aria-hidden="true"
    />
  );
}

function TicketBarcode({ value }: { value: string }) {
  const hashCode = (s: string) =>
    s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  const seed = hashCode(value);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const bars = Array.from({ length: 60 }).map((_, index) => {
    const rand = random(seed + index);
    return { width: rand > 0.7 ? 2.5 : 1.5 };
  });

  const spacing = 1.5;
  const totalWidth =
    bars.reduce((acc, bar) => acc + bar.width + spacing, 0) - spacing;
  const svgWidth = 250;
  const svgHeight = 70;
  let currentX = (svgWidth - totalWidth) / 2;

  return (
    <div className="flex flex-col items-center py-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        aria-label={`Barcode for ${value}`}
        className="fill-current text-foreground"
      >
        {bars.map((bar, index) => {
          const x = currentX;
          currentX += bar.width + spacing;
          return (
            <rect key={index} x={x} y="10" width={bar.width} height="50" />
          );
        })}
      </svg>
      <p className="mt-2 font-mono text-xs tracking-[0.25em] text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

function SuccessConfetti() {
  const [pieces, setPieces] = React.useState<
    { left: number; delay: number; duration: number; rotate: number; color: string }[]
  >([]);

  React.useEffect(() => {
    const colors = ["#ec1846", "#fda4af", "#0f172a", "#fbbf24", "#38bdf8"];
    setPieces(
      Array.from({ length: 48 }).map((_, i) => ({
        left: (i * 17) % 100,
        delay: (i % 10) * 0.15,
        duration: 2.5 + (i % 5) * 0.4,
        rotate: (i * 37) % 360,
        color: colors[i % colors.length],
      })),
    );
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes alterstays-confetti-fall {
            0% {
              transform: translateY(-12vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(540deg);
              opacity: 0;
            }
          }
        `}
      </style>
      {pieces.map((piece, i) => (
        <div
          key={i}
          className="absolute h-3 w-1.5 rounded-sm"
          style={{
            left: `${piece.left}%`,
            top: "-5%",
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotate}deg)`,
            animation: `alterstays-confetti-fall ${piece.duration}s ${piece.delay}s linear forwards`,
          }}
        />
      ))}
    </div>
  );
}

export type BookingResultTicketProps = React.HTMLAttributes<HTMLDivElement> & {
  variant: BookingResultTicketVariant;
  title: string;
  subtitle: string;
  reservationNumber: string;
  amountLabel: string;
  amount: string;
  /** ISO date string */
  dateIso: string;
  propertyName: string;
  stayLine?: string;
  detailLabel?: string;
  detailValue?: string;
  barcodeValue: string;
  showConfetti?: boolean;
  iconSpin?: boolean;
};

export const BookingResultTicket = React.forwardRef<
  HTMLDivElement,
  BookingResultTicketProps
>(
  (
    {
      className,
      variant,
      title,
      subtitle,
      reservationNumber,
      amountLabel = "Amount paid",
      amount,
      dateIso,
      propertyName,
      stayLine,
      detailLabel,
      detailValue,
      barcodeValue,
      showConfetti = false,
      iconSpin = false,
      ...props
    },
    ref,
  ) => {
    const [confettiVisible, setConfettiVisible] = React.useState(false);
    const Icon = variantIcon[variant];

    React.useEffect(() => {
      if (!showConfetti) return undefined;
      const show = window.setTimeout(() => setConfettiVisible(true), 80);
      const hide = window.setTimeout(() => setConfettiVisible(false), 5500);
      return () => {
        window.clearTimeout(show);
        window.clearTimeout(hide);
      };
    }, [showConfetti]);

    const formattedDate = format(
      parseISO(dateIso),
      "d MMM yyyy · HH:mm",
    );

    return (
      <>
        {confettiVisible ? <SuccessConfetti /> : null}
        <div
          ref={ref}
          className={cn(
            "relative z-10 w-full max-w-sm rounded-2xl border border-black/5 bg-white font-sans text-foreground shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)]",
            "animate-in fade-in-0 zoom-in-95 duration-500",
            className,
          )}
          {...props}
        >
          <div
            className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-background"
            aria-hidden
          />
          <div
            className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-background"
            aria-hidden
          />

          <div className="flex flex-col items-center px-6 pb-2 pt-8 text-center sm:px-8">
            <div
              className={cn(
                "rounded-full p-3 ring-4 ring-white",
                variantIconWrap[variant],
              )}
            >
              <Icon
                className={cn(
                  "size-9",
                  iconSpin && "animate-spin",
                )}
                aria-hidden
              />
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          </div>

          <div className="space-y-5 px-6 pb-8 pt-4 sm:px-8">
            <DashedLine />

            <div className="text-left">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Property
              </p>
              <p className="mt-0.5 text-sm font-semibold">{propertyName}</p>
              {stayLine ? (
                <p className="mt-1 text-xs text-muted-foreground">{stayLine}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Booking ID
                </p>
                <p className="mt-0.5 font-mono text-sm font-medium">
                  {reservationNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {amountLabel}
                </p>
                <p className="mt-0.5 text-lg font-bold text-brand">{amount}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Date &amp; time
              </p>
              <p className="mt-0.5 text-sm font-medium">{formattedDate}</p>
            </div>

            {detailLabel && detailValue ? (
              <div className="rounded-md border bg-muted/30 px-4 py-3 text-left">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {detailLabel}
                </p>
                <p className="mt-0.5 text-sm font-medium">{detailValue}</p>
              </div>
            ) : null}

            <DashedLine />
            <TicketBarcode value={barcodeValue} />
          </div>
        </div>
      </>
    );
  },
);

BookingResultTicket.displayName = "BookingResultTicket";
