import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Gift,
  Flame,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DiscountOfferSectionProps {
  onClaimOffer: (promoCode: string) => void;
}

export function DiscountOfferSection({ onClaimOffer }: DiscountOfferSectionProps) {
  const [copied, setCopied] = useState(false);

  // Persistent 24-hour countdown timer
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 14, minutes: 38, seconds: 45 });

  useEffect(() => {
    // Get or set end time in localStorage for realistic countdown
    const storageKey = "febiola_discount_endtime";
    let endTime = localStorage.getItem(storageKey);

    if (!endTime || parseInt(endTime, 10) < Date.now()) {
      // Set timer 18 hours from now
      const newEndTime = Date.now() + (18 * 3600 + 42 * 60 + 15) * 1000;
      localStorage.setItem(storageKey, newEndTime.toString());
      endTime = newEndTime.toString();
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, parseInt(endTime!, 10) - Date.now());
      if (remaining <= 0) {
        // Reset 24 hours cycle
        const nextEnd = Date.now() + 24 * 3600 * 1000;
        localStorage.setItem(storageKey, nextEnd.toString());
      } else {
        const totalSecs = Math.floor(remaining / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const promoCode = "GLOW25";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    toast.success(`Promo code ${promoCode} copied! 25% discount activated.`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-deep via-[#2C1D13] to-surface-deep text-primary-foreground py-20 px-6 sm:px-10 lg:py-24 border-y border-gold/25">
      {/* Ambient Glow Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/15 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header Texts */}
        <div className="text-center">
          <h2 className="font-script text-6xl sm:text-7xl md:text-8xl text-gold">
            Sanctuary Privilege
          </h2>
          <p className="mt-2 font-display text-2xl sm:text-3xl italic text-primary-foreground/95 tracking-wide">
            Enjoy 25% Off Your First Luxury In-Home Spa Ritual
          </p>
          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm font-light leading-relaxed text-primary-foreground/80">
            Immerse yourself in deeply restorative muscular therapy and pure botanical wellness.
            Delivered directly to your residence in any US state with full five-star equipment.
          </p>
        </div>

        {/* Modern Live Countdown Timer */}
        <div className="mt-10 flex items-center justify-center gap-3 sm:gap-6">
          {[
            { label: "Hours", value: String(timeLeft.hours).padStart(2, "0") },
            { label: "Minutes", value: String(timeLeft.minutes).padStart(2, "0") },
            { label: "Seconds", value: String(timeLeft.seconds).padStart(2, "0") },
          ].map((item, idx) => (
            <React.Fragment key={item.label}>
              <div className="flex flex-col items-center">
                <div className="relative flex size-20 sm:size-24 flex-col items-center justify-center rounded-2xl border border-gold/40 bg-black/40 backdrop-blur-md shadow-2xl shadow-gold/5 transition-transform hover:scale-105">
                  <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gold">
                    {item.value}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-primary-foreground/60 mt-0.5">
                    {item.label}
                  </span>
                  {/* Subtle Corner Accents */}
                  <span className="absolute top-1.5 left-1.5 size-1 rounded-full bg-gold/60" />
                  <span className="absolute top-1.5 right-1.5 size-1 rounded-full bg-gold/60" />
                </div>
              </div>
              {idx < 2 && (
                <span className="font-display text-3xl font-bold text-gold/60 -mt-4 animate-pulse">
                  :
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Offer Details Box with Glassmorphism Card */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gold/30 bg-black/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-white/10 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="grid size-9 place-items-center rounded-full bg-gold/15 text-gold shrink-0">
                <Percent className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-100">25% Instant Savings</p>
                <p className="text-[10px] text-primary-foreground/70">Applied to any ritual</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="grid size-9 place-items-center rounded-full bg-gold/15 text-gold shrink-0">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-100">Free Botanical Oil</p>
                <p className="text-[10px] text-primary-foreground/70">French Lavender &amp; Jojoba</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="grid size-9 place-items-center rounded-full bg-gold/15 text-gold shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-100">Licensed Therapist</p>
                <p className="text-[10px] text-primary-foreground/70">Heated spa table included</p>
              </div>
            </div>
          </div>

          {/* Coupon Code & Action CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[11px] uppercase tracking-wider text-primary-foreground/70 hidden sm:inline">
                Code:
              </span>
              <div className="flex items-center justify-between w-full sm:w-auto gap-2 bg-neutral-900/80 border border-gold/50 rounded-xl px-4 py-2 font-mono text-sm font-bold text-gold shadow-inner">
                <span className="tracking-widest">{promoCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 rounded-md hover:bg-gold/20 text-gold-soft transition-colors ml-2"
                  title="Copy Coupon Code"
                >
                  {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              variant="spa"
              size="lg"
              className="w-full sm:w-auto rounded-xl px-8 shadow-xl font-semibold text-xs uppercase tracking-wider"
              onClick={() => {
                handleCopyCode();
                onClaimOffer(promoCode);
              }}
            >
              <span>Claim 25% Off &amp; Book</span>
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
