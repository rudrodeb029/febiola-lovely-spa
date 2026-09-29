import React, { useState, useEffect } from "react";
import { Sparkles, Clock, ArrowRight, Flame, Percent, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface TopDiscountBannerProps {
  onClaimOffer: (promoCode: string) => void;
}

export function TopDiscountBanner({ onClaimOffer }: TopDiscountBannerProps) {
  const [copied, setCopied] = useState(false);

  // Persistent 24-hour countdown timer
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 18, minutes: 39, seconds: 34 });

  useEffect(() => {
    const storageKey = "febiola_discount_endtime";
    let endTime = localStorage.getItem(storageKey);

    if (!endTime || parseInt(endTime, 10) < Date.now()) {
      const newEndTime = Date.now() + (18 * 3600 + 39 * 60 + 34) * 1000;
      localStorage.setItem(storageKey, newEndTime.toString());
      endTime = newEndTime.toString();
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, parseInt(endTime!, 10) - Date.now());
      if (remaining <= 0) {
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

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    toast.success(`Code ${promoCode} copied! 25% discount ready to apply.`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#2A1C12] via-[#4A3423] to-[#2A1C12] py-2.5 px-4 text-primary-foreground border-b border-gold/35 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-center sm:justify-between gap-3 flex-wrap text-center sm:text-left">
        {/* Left: Offer text & code */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold border border-gold/40 animate-pulse">
            <Flame className="size-3 text-gold" />
            <span>25% OFF</span>
          </span>
          <p className="text-xs font-medium text-neutral-100">
            Seasonal Sanctuary Offer: <strong className="text-gold-soft font-semibold">25% Off All Rituals</strong> with code
          </p>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-gold bg-black/40 hover:bg-black/60 px-2.5 py-0.5 rounded-md border border-gold/50 transition-colors shadow-inner cursor-pointer"
            title="Click to copy code"
          >
            <span>{promoCode}</span>
            {copied ? (
              <Check className="size-3 text-emerald-400" />
            ) : (
              <Copy className="size-3 text-gold/70" />
            )}
          </button>
        </div>

        {/* Right: Live Countdown Timer & CTA */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Live Countdown Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono bg-black/40 px-3 py-1 rounded-full border border-gold/40 text-gold-soft shadow-inner">
            <Clock className="size-3 text-gold" />
            <span className="text-neutral-400 text-[10px] uppercase font-sans font-semibold mr-0.5">Ends in:</span>
            <span className="font-bold text-gold">
              {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => onClaimOffer(promoCode)}
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-950 bg-gold hover:bg-gold-soft px-3.5 py-1 rounded-full transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Claim Discount</span>
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
