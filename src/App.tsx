import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flower2,
  HeartHandshake,
  Home,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LiveConciergeWidget } from "@/components/LiveConciergeWidget";
import { AdminPanel } from "@/components/AdminPanel";
import { DiscountOfferSection } from "@/components/DiscountOfferSection";

// Spa Assets
import heroImage from "@/assets/spa-man.jpg";
import productsImage from "@/assets/spa-products.jpg";
import interiorImage from "@/assets/spa-interior.jpg";
import bandImage from "@/assets/spa-band-treatment.jpg";
import serviceTraditionalImage from "@/assets/service-traditional.jpg";
import serviceAromatherapyImage from "@/assets/service-aromatherapy.jpg";
import serviceLulurImage from "@/assets/service-lulur.jpg";
import serviceFullbodyImage from "@/assets/service-fullbody.jpg";
import serviceFacialImage from "@/assets/service-facial.jpg";
import serviceReflexologyImage from "@/assets/service-reflexology.jpg";
import relaxImage from "@/assets/spa-relax.jpg";
import faqImage from "@/assets/spa-faq.jpg";
import journal1Image from "@/assets/spa-journal-1.jpg";
import journal2Image from "@/assets/service-aromatherapy.jpg";
import journal3Image from "@/assets/service-facial.jpg";
import reserveImage from "@/assets/spa-reserve.jpg";

interface Treatment {
  name: string;
  note: string;
  time: string;
  price: string;
  image: string;
  pos: string;
}

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana",
  "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
  "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "Washington D.C.", "West Virginia", "Wisconsin", "Wyoming"
];

const treatments: Treatment[] = [
  {
    name: "Traditional Massage",
    note: "Release deep chronic tension and restore energetic balance through flowing, rhythmic therapeutic pressure.",
    time: "60 min",
    price: "$95",
    image: serviceTraditionalImage,
    pos: "center",
  },
  {
    name: "Aromatherapy Massage",
    note: "A calming sensory ritual infused with pure organic botanical essential oils tailored to your mood.",
    time: "75 min",
    price: "$120",
    image: serviceAromatherapyImage,
    pos: "center",
  },
  {
    name: "Heritage Botanical Body Scrub",
    note: "An authentic exfoliating polish using organic golden turmeric, botanical herbs, and jasmine essence.",
    time: "90 min",
    price: "$145",
    image: serviceLulurImage,
    pos: "center",
  },
  {
    name: "Full Body Therapeutic Journey",
    note: "A complete head-to-toe restorative experience designed for profound relaxation, recovery, and renewal.",
    time: "90 min",
    price: "$160",
    image: serviceFullbodyImage,
    pos: "center",
  },
  {
    name: "Traditional Massage + Totok Facial",
    note: "Therapeutic muscular bodywork paired with ancient acupressure facial point therapy for a radiant glow.",
    time: "105 min",
    price: "$175",
    image: serviceFacialImage,
    pos: "center",
  },
  {
    name: "Traditional Massage + Reflexology",
    note: "Targeted foot pressure-point therapy combined with full-body massage to revive circulation and vitality.",
    time: "90 min",
    price: "$150",
    image: serviceReflexologyImage,
    pos: "center",
  },
];

const faqs: [string, string][] = [
  [
    "Do you offer in-home spa visits across all US states?",
    "Yes! We provide licensed, professional mobile spa therapists throughout all 50 US states. Our certified wellness specialists arrive fully equipped with heated massage tables, luxury linens, aromatherapy diffusers, and organic botanical oils directly to your home, hotel, or private residence.",
  ],
  [
    "Are all therapists state-licensed and background-checked?",
    "Every Febiola therapist is 100% state-licensed by their respective state massage therapy board, fully insured, background-checked, and vetted for exceptional clinical and holistic technique.",
  ],
  [
    "How soon should I prepare before an in-home therapist arrives?",
    "Please clear a quiet 10x10 ft space for the massage table. Your therapist will arrive 10-15 minutes prior to your scheduled time to set up the tranquil ambiance.",
  ],
  [
    "What is the cancellation or rescheduling policy?",
    "We understand plans change. We ask for at least 24 hours notice to reschedule or cancel your appointment without any penalty.",
  ],
  [
    "Can I choose custom scents or organic essential oils?",
    "Yes. Prior to every ritual, your therapist presents a curated selection of organic, cold-pressed botanical oil blends (French lavender, eucalyptus, warm sandalwood, and lemongrass).",
  ],
  [
    "How far in advance should I book my appointment?",
    "We recommend booking 24–48 hours in advance to secure your preferred therapist and time slot, although same-day bookings are frequently available across major US metropolitan areas.",
  ],
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#home"
      className={`flex items-center gap-2.5 transition-opacity hover:opacity-90 ${
        light ? "text-primary-foreground" : "text-foreground"
      }`}
      aria-label="Febiola Lovely Spa home"
    >
      <span className="grid size-9 place-items-center rounded-full border border-current/35">
        <Flower2 className="size-5" strokeWidth={1.3} />
      </span>
      <span className="leading-none">
        <strong className="block font-display text-xl font-medium tracking-wide">
          Febiola
        </strong>
        <span className="block text-[8px] uppercase tracking-[0.28em] opacity-75">
          Lovely Spa USA
        </span>
      </span>
    </a>
  );
}

function SectionTitle({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  light?: boolean;
}) {
  return (
    <div
      className={`mx-auto max-w-2xl text-center ${
        light ? "text-primary-foreground" : "text-foreground"
      }`}
    >
      {eyebrow && (
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] opacity-70">
          {eyebrow}
        </p>
      )}
      <h2 className="font-script text-5xl leading-tight sm:text-6xl md:text-7xl">
        {title}
      </h2>
      {copy && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-75">
          {copy}
        </p>
      )}
    </div>
  );
}

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return typeof window !== "undefined" && window.location.hash === "#admin";
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(treatments[0]?.name ?? "");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedState, setSelectedState] = useState("California");
  const [serviceLocationType, setServiceLocationType] = useState("In-Home Mobile Visit");
  const [guestCity, setGuestCity] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("11:00 AM");
  const [guestNotes, setGuestNotes] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [inputPromo, setInputPromo] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === "#admin");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setBookingSuccess(false);
    setBookingOpen(true);
  };

  const handleClaimOffer = (promoCode: string) => {
    setAppliedPromo(promoCode);
    setInputPromo(promoCode);
    setBookingSuccess(false);
    setBookingOpen(true);
    toast.success(`✨ Seasonal Offer Applied: 25% Off with code ${promoCode}!`);
  };

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    if (inputPromo.trim().toUpperCase() === "GLOW25" || inputPromo.trim().toUpperCase() === "FEBIOLA25") {
      setAppliedPromo(inputPromo.trim().toUpperCase());
      toast.success("Promo code GLOW25 applied! 25% discount unlocked.");
    } else {
      toast.error("Invalid promo code. Use GLOW25 for 25% off!");
    }
  };

  // Price calculations with promo
  const rawPriceStr = treatments.find((t) => t.name === selectedService)?.price || "$150";
  const basePriceNum = parseInt(rawPriceStr.replace(/[^0-9]/g, ""), 10) || 150;
  const isPromoApplied = appliedPromo.toUpperCase() === "GLOW25" || appliedPromo.toUpperCase() === "FEBIOLA25";
  const finalPriceNum = isPromoApplied ? Math.round(basePriceNum * 0.75) : basePriceNum;
  const computedPriceStr = `$${finalPriceNum}`;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    const newRes = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName,
      guestPhone,
      service: selectedService,
      state: selectedState,
      city: guestCity || selectedState,
      date: bookingDate || new Date().toISOString().split("T")[0],
      timeSlot: bookingTime,
      notes: isPromoApplied
        ? `${guestNotes ? guestNotes + " | " : ""}Promo: ${appliedPromo} (25% Discount Applied)`
        : guestNotes,
      status: "Pending",
      price: computedPriceStr,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("febiola_spa_reservations") || "[]"
      );
      localStorage.setItem(
        "febiola_spa_reservations",
        JSON.stringify([newRes, ...existing])
      );
    } catch {
      // ignore
    }

    setBookingSuccess(true);
    toast.success("Reservation request sent! Our US Concierge will confirm your appointment shortly.");
  };

  if (isAdminView) {
    return (
      <AdminPanel
        onBackToSite={() => {
          window.location.hash = "#home";
          setIsAdminView(false);
        }}
      />
    );
  }

  return (
    <main id="home" className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Top Banner: Nationwide Coverage */}
      <div className="bg-surface-deep/90 py-2 px-4 text-center text-[11px] font-medium tracking-wide text-primary-foreground/90 border-b border-white/10">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-gold" />
          <span>Premier Luxury Spa &amp; In-Home Wellness — <strong>Serving All 50 US States Nationwide</strong></span>
        </span>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-border/40 bg-card/95 px-6 backdrop-blur-md lg:px-14">
        <Brand />

        <nav
          className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.18em] lg:flex"
          aria-label="Main navigation"
        >
          <a className="transition-colors hover:text-gold" href="#home">
            Home
          </a>
          <a className="transition-colors hover:text-gold" href="#about">
            About
          </a>
          <a className="transition-colors hover:text-gold" href="#services">
            Services
          </a>
          <a className="transition-colors hover:text-gold" href="#nationwide">
            US Coverage
          </a>
          <a className="transition-colors hover:text-gold" href="#journal">
            Journal
          </a>
          <a className="transition-colors hover:text-gold" href="#contact">
            Contact
          </a>
          <Button
            size="sm"
            variant="spa"
            className="rounded-full px-5 shadow"
            onClick={() => handleOpenBooking()}
          >
            Book now
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        {menuOpen && (
          <nav className="absolute inset-x-0 top-20 z-50 grid gap-5 border-b border-border bg-card p-7 text-sm shadow-xl lg:hidden">
            {["About", "Services", "US Coverage", "Journal", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="font-medium text-foreground hover:text-gold"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Button
              variant="spa"
              className="mt-2 w-full"
              onClick={() => {
                setMenuOpen(false);
                handleOpenBooking();
              }}
            >
              Book now
            </Button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[720px] text-primary-foreground">
        <img
          src={heroImage}
          alt="A restorative treatment in the warm Febiola spa sanctuary"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-overlay/80" />
        <div className="relative mx-auto flex min-h-[720px] max-w-6xl items-center px-6 py-20 sm:px-10 lg:justify-end">
          <div className="spa-rise max-w-xl text-center lg:text-left">
            <h1 className="font-script text-7xl leading-[0.85] sm:text-8xl lg:text-9xl">
              Febiola
            </h1>
            <p className="mt-3 font-display text-3xl italic sm:text-4xl">
              Lovely Spa
            </p>
            <div className="my-7 h-px w-24 bg-gold-soft/80 mx-auto lg:mx-0" />
            <h2 className="font-display text-2xl italic tracking-wide">
              Restore Your Glow
            </h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-primary-foreground/80">
              A peaceful luxury wellness experience delivered directly to your home,
              hotel, or private residence by certified, licensed therapists across America.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button
                variant="spaOutline"
                size="lg"
                className="rounded-full px-6"
                asChild
              >
                <a href="#services">
                  Explore rituals <ArrowRight className="ml-1 size-4" />
                </a>
              </Button>
              <Button
                variant="spa"
                size="lg"
                className="rounded-full px-7 shadow-lg"
                onClick={() => handleOpenBooking()}
              >
                Book in your state
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Discount Offer Section with Live Countdown Timer */}
      <DiscountOfferSection onClaimOffer={handleClaimOffer} />

      {/* About Section */}
      <section id="about" className="bg-background px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Your ritual of renewal
            </p>
            <h2 className="mt-4 font-display text-6xl leading-[0.9] sm:text-7xl">
              Luxury
              <br />
              <span className="font-script text-7xl text-primary sm:text-8xl">
                Spa
              </span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground">
              Rooted in centuries-old holistic wellness traditions, every Febiola
              experience is thoughtfully composed to quiet the mind, release muscular
              tension, and restore your natural inner radiance—delivered across all 50 states.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button
                variant="spa"
                className="rounded-full px-6"
                onClick={() => handleOpenBooking()}
              >
                Book a ritual
              </Button>
              <a
                href="#services"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:underline"
              >
                View menu →
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="aspect-[4/5] overflow-hidden rounded-t-[45%] shadow-2xl">
              <img
                src={interiorImage}
                alt="The calm atmosphere inside Febiola spa"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-sm bg-primary px-6 py-5 text-primary-foreground shadow-2xl sm:-left-8">
              <p className="font-display text-2xl italic">Feel renewed</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] opacity-80">
                Mind · body · spirit
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="mx-auto mt-28 max-w-6xl border-t border-border pt-16 text-center">
          <p className="font-script text-4xl text-primary sm:text-5xl">
            The Art of Mindful Sanctuary
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "State-Licensed Therapists",
                text: "Every specialist is vetted, insured, and licensed by their respective US state massage board.",
              },
              {
                icon: Leaf,
                title: "Pure Organic Botanicals",
                text: "Cold-pressed jojoba, organic essential oils, pure mineral salts, and chemical-free formulas.",
              },
              {
                icon: Home,
                title: "In-Home & Studio Luxury",
                text: "Professional heated spa tables and serene aromatherapy brought seamlessly to your residence.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-border/50 bg-card p-6 shadow-sm"
              >
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-gold/15 text-gold">
                  <Icon className="size-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-2xl">{title}</h3>
                <p className="mx-auto mt-2 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nationwide In-Home Spa Banner */}
      <section id="nationwide" className="grid bg-surface-deep text-primary-foreground lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex min-h-72 items-center px-10 py-16 lg:min-h-[480px] lg:px-20">
          <div>
            <p className="font-display text-4xl italic leading-tight sm:text-5xl">
              Professional
              <br />
              In-Home Spa
              <br />
              Across All 50 States
            </p>
            <div className="mt-6 h-px w-16 bg-gold" />
            <p className="mt-5 text-xs uppercase tracking-[0.25em] opacity-70">
              New York · California · Florida · Texas · Nationwide
            </p>
            <p className="mt-3 text-xs leading-relaxed opacity-80 max-w-md font-light">
              Experience five-star relaxation without leaving your doorstep. Our therapists
              travel to private residences, hotels, and luxury estates throughout the US.
            </p>
            <Button
              variant="spaOutline"
              className="mt-8 rounded-full"
              onClick={() => handleOpenBooking("In-Home Spa Ritual (US Nationwide)")}
            >
              Request home visit in your state <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
        <img
          src={bandImage}
          alt="Professional Febiola wellness treatment"
          loading="lazy"
          className="h-full min-h-80 w-full object-cover"
        />
      </section>

      {/* Services Section */}
      <section id="services" className="bg-background px-6 py-24 sm:px-10 lg:py-28">
        <SectionTitle
          eyebrow="Services"
          title="Massage & Spa"
          copy="Slow, intentional treatments designed to release tension, soften the senses, and welcome you home to your body."
        />

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((item) => (
            <article
              key={item.name}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div>
                <div className="aspect-[1.45] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    style={{ objectPosition: item.pos }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-3 min-h-12 text-xs leading-relaxed text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60 bg-muted/20 p-6 pt-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em]">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" /> {item.time}
                  </span>
                  <span className="font-bold text-primary">
                    from {item.price}
                  </span>
                </div>
                <Button
                  variant="spa"
                  size="sm"
                  className="mt-4 w-full rounded-md"
                  onClick={() => handleOpenBooking(item.name)}
                >
                  Book this ritual
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Relaxation Breakpoint */}
      <section className="grid bg-surface-deep text-primary-foreground lg:grid-cols-[1.45fr_0.55fr]">
        <img
          src={relaxImage}
          alt="A peaceful massage ritual"
          loading="lazy"
          className="h-full min-h-96 w-full object-cover"
        />
        <div className="flex min-h-72 items-center justify-center p-10 text-center">
          <div>
            <p className="font-display text-4xl italic leading-tight sm:text-5xl">
              Better
              <br />
              Relaxation
              <br />
              Starts Here
            </p>
            <Button
              variant="spaOutline"
              size="sm"
              className="mt-6 rounded-full"
              onClick={() => handleOpenBooking()}
            >
              Schedule now
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <Quote className="mx-auto size-10 text-gold" strokeWidth={1.2} />
          <p className="mt-6 font-script text-5xl sm:text-6xl text-primary">
            What Our Guests Say
          </p>
          <div className="mx-auto mt-8 flex justify-center gap-1.5 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-current" />
            ))}
          </div>
          <blockquote className="mx-auto mt-7 max-w-2xl font-display text-2xl italic leading-relaxed sm:text-3xl text-foreground">
            “A beautiful pause in the middle of a busy week. The therapist arrived on time
            with a heated table, organic lavender oil, and expert technique. The chronic stiffness
            in my neck and shoulders completely dissolved.”
          </blockquote>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Sarah M. · Manhattan, New York
          </p>
          <div className="mt-8 flex justify-center gap-6 text-xs text-muted-foreground">
            <span>⭐️⭐️⭐️⭐️⭐️ “Incredible in-home service in LA” — <strong>David R., California</strong></span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">⭐️⭐️⭐️⭐️⭐️ “Pure luxury in Miami” — <strong>Elena V., Florida</strong></span>
          </div>
          <Button
            variant="spa"
            className="mt-9 rounded-full px-8 shadow-md"
            onClick={() => handleOpenBooking()}
          >
            Reserve your time
          </Button>
        </div>
      </section>

      {/* Pure Spa Moments */}
      <section className="grid bg-surface-deep text-primary-foreground lg:grid-cols-2">
        <div className="relative min-h-[480px] overflow-hidden">
          <img
            src={productsImage}
            alt="Natural botanical ingredients used in Febiola rituals"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-overlay/40" />
        </div>
        <div className="flex items-center px-8 py-20 sm:px-16 lg:px-24">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-soft">
              Thoughtfully sourced
            </p>
            <h2 className="mt-4 font-script text-6xl sm:text-7xl">
              Pure Spa Moments
            </h2>
            <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-primary-foreground/80">
              Our treatments are prepared with certified organic botanical oils,
              therapeutic grade essential extracts, mineral-rich salts, and fresh floral essences
              chosen for their holistic purity and sensory relaxation.
            </p>
            <a
              href="#journal"
              className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-soft hover:underline"
            >
              Our philosophy <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ & Benefits Section */}
      <section className="bg-background px-6 py-24 sm:px-10 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="font-script text-6xl leading-[0.95] text-primary sm:text-7xl">
              Spa Benefits
              <br />
              Journey to Glowing Health
            </h2>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Regular restorative care encourages lymphatic drainage, relieves
              chronic neck and shoulder tightness from desk work, promotes deep restful
              sleep, and creates sacred space for a calmer, centered self.
            </p>
            <Button
              variant="spa"
              className="mt-7 rounded-full"
              asChild
            >
              <a href="#services">Discover our rituals</a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-6xl gap-14 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="mb-6 font-display text-3xl italic">
              Frequently Asked Questions
            </p>
            <div className="divide-y divide-border border-y border-border">
              {faqs.map(([question, answer], index) => (
                <div key={question} className="py-2">
                  <button
                    className="flex w-full items-center justify-between py-4 text-left font-display text-lg text-foreground transition-colors hover:text-gold"
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    aria-expanded={openFaq === index}
                  >
                    <span>{question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180 text-gold" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <p className="max-w-2xl pb-5 text-xs leading-relaxed text-muted-foreground">
                      {answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[470px] overflow-hidden rounded-xl shadow-lg">
            <img
              src={faqImage}
              alt="Febiola spa preparation room"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-lg bg-primary/95 p-6 text-primary-foreground backdrop-blur-sm">
              <p className="font-display text-2xl italic">Nationwide Concierge</p>
              <p className="mt-2 text-xs opacity-85">
                Our care concierge is ready to assist with scheduling, custom corporate events, and state bookings.
              </p>
              <a
                href="tel:+16464313060"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-soft hover:underline"
              >
                Call Concierge: +1 (646) 431-3060 <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mid Callout */}
      <section className="relative min-h-[360px] text-primary-foreground">
        <img
          src={productsImage}
          alt="Febiola spa products and warm candlelight"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-overlay/85" />
        <div className="relative mx-auto flex min-h-[360px] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <Brand light />
          <p className="mt-6 max-w-xl text-sm font-light leading-relaxed opacity-85">
            Slow down. Breathe deeply. Let the city's noise fade away and return
            to your natural rhythm with our licensed nationwide therapists.
          </p>
          <Button
            variant="spaOutline"
            size="sm"
            className="mt-6 rounded-full px-6"
            onClick={() => handleOpenBooking()}
          >
            Book your sanctuary
          </Button>
        </div>
      </section>

      {/* Journal Section */}
      <section id="journal" className="bg-background px-6 py-24 sm:px-10">
        <SectionTitle
          eyebrow="Our journal"
          title="Rituals & Stories"
          copy="Thoughtful wellness guides to bring the calm and care of the spa into your everyday life."
        />

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            {
              title: "Tips For A Home Spa",
              desc: "How to craft a relaxing botanical soak and quiet atmosphere in your own bathroom.",
              img: journal1Image,
            },
            {
              title: "How Massage Helps Sleep",
              desc: "The neurological science of how rhythmic pressure regulates cortisol and nervous systems.",
              img: journal2Image,
            },
            {
              title: "Morning Rituals for Calm",
              desc: "Five simple breathwork and skin wellness habits to begin each morning grounded.",
              img: journal3Image,
            },
          ].map((post) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[1.3] overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-overlay/30 p-6 text-primary-foreground">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-[9px] uppercase tracking-[0.22em] backdrop-blur-sm">
                    Wellness
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-foreground">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {post.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reserve" className="relative min-h-[460px] text-primary-foreground">
        <img
          src={reserveImage}
          alt="Reserve a serene Febiola spa experience"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-overlay/85" />
        <div className="relative mx-auto grid min-h-[460px] max-w-6xl items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-2">
          <div>
            <p className="font-script text-6xl sm:text-7xl md:text-8xl">
              Let's booking
              <br />
              now!
            </p>
          </div>
          <div>
            <p className="font-display text-5xl italic sm:text-6xl">
              Reservations
            </p>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed opacity-85">
              Available in all 50 states. Choose your ritual and let us curate the time
              and space for you to feel completely restored, refreshed, and relaxed.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="spa"
                size="lg"
                className="rounded-full px-8 shadow-xl"
                onClick={() => handleOpenBooking()}
              >
                Book online now <ArrowRight className="ml-1 size-4" />
              </Button>
              <Button
                variant="spaOutline"
                size="lg"
                className="rounded-full px-6"
                asChild
              >
                <a href="mailto:concierge@febiolaspa.com">
                  <Mail className="mr-2 size-4" /> Email concierge
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-surface-deep px-6 py-16 text-primary-foreground sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 border-b border-primary-foreground/15 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Brand light />
            <p className="mt-5 text-xs font-light leading-relaxed opacity-75">
              A private luxury sanctuary for therapeutic bodywork, organic botanical care,
              and restorative wellness across all 50 US states.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft">
              Concierge Hours
            </h3>
            <p className="mt-4 text-xs leading-relaxed opacity-80">
              Monday – Sunday
              <br />
              8:00 AM – 10:00 PM EST
              <br />
              <span className="text-[10px] text-gold-soft">7 Days a Week Nationwide</span>
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft">
              US Coverage &amp; Contact
            </h3>
            <p className="mt-4 text-xs leading-relaxed opacity-80">
              Serving All 50 US States
              <br />
              <a
                href="mailto:concierge@febiolaspa.com"
                className="hover:underline"
              >
                concierge@febiolaspa.com
              </a>
              <br />
              <a href="tel:+16464313060" className="hover:underline font-medium text-gold-soft">
                +1 (646) 431-3060
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-soft">
              Connect
            </h3>
            <div className="mt-4 flex flex-col gap-2 text-xs opacity-80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-soft hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/16462446370?text=Hello%20Febiola%20Spa%2C%20I'd%20like%20to%20inquire%20about%20a%20spa%20ritual."
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-soft hover:underline"
              >
                WhatsApp Concierge (+1 646-244-6370)
              </a>
              <a
                href="tel:+16464313060"
                className="hover:text-gold-soft hover:underline"
              >
                Phone Concierge (+1 646-431-3060)
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-soft hover:underline"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-8 text-[10px] uppercase tracking-[0.2em] opacity-60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Febiola Lovely Spa USA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#home" className="hover:underline">
              Terms of Service
            </a>
            <a href="#home" className="hover:underline">
              State Licensing Info
            </a>
            <button
              onClick={() => {
                window.location.hash = "#admin";
                setIsAdminView(true);
              }}
              className="text-gold-soft hover:underline font-semibold"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto bg-card border-border sm:rounded-2xl p-5 sm:p-7 shadow-2xl overscroll-contain">
          <DialogHeader className="space-y-1.5 text-left pr-8 pb-1">
            <DialogTitle className="font-display text-3xl font-semibold text-foreground">
              Reserve Your Ritual
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Select your US state and treatment. Our concierge will pair you with a
              certified state-licensed specialist in your area.
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary shadow-sm">
                <CheckCircle2 className="size-9 text-gold" />
              </div>
              <div>
                <h4 className="font-display text-3xl text-foreground">
                  Booking Request Sent!
                </h4>
                <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{guestName}</strong>. We have registered your
                  request for <strong>{selectedService}</strong> in{" "}
                  <strong>{guestCity ? `${guestCity}, ${selectedState}` : selectedState}</strong> on{" "}
                  <strong>{bookingDate || "your requested date"}</strong> at{" "}
                  <strong>{bookingTime}</strong>.
                </p>
              </div>
              <Button
                variant="spa"
                className="mt-4 w-full rounded-xl py-3 text-xs"
                onClick={() => setBookingOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-3.5 pt-1 text-xs">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Select Ritual
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  {treatments.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.time} · {t.price})
                    </option>
                  ))}
                  <option value="In-Home Spa Ritual (US Nationwide)">
                    In-Home Spa Ritual (Custom Visit)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    US State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {usStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    City / Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Austin, 78701"
                    value={guestCity}
                    onChange={(e) => setGuestCity(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Noon)</option>
                    <option value="01:30 PM">01:30 PM (Afternoon)</option>
                    <option value="03:30 PM">03:30 PM (Afternoon)</option>
                    <option value="05:30 PM">05:30 PM (Evening)</option>
                    <option value="07:00 PM">07:00 PM (Night)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Miller"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. (555) 234-5678"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Special Notes / Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Organic lavender oil preference, focus on upper back & neck..."
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Promo Code & Dynamic Price Banner */}
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-gold" />
                    <span>Estimated Rate</span>
                  </span>
                  <div className="flex items-baseline gap-2">
                    {isPromoApplied && (
                      <span className="text-xs text-muted-foreground line-through">
                        {rawPriceStr}
                      </span>
                    )}
                    <span className="text-sm font-bold text-primary">
                      {computedPriceStr}
                    </span>
                    {isPromoApplied && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.2 rounded-full">
                        25% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-gold/20">
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g. GLOW25)"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value.toUpperCase())}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground uppercase placeholder:normal-case shadow-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Apply
                  </button>
                </div>

                {isPromoApplied ? (
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    <span>Promo code {appliedPromo} applied: 25% discount activated!</span>
                  </p>
                ) : (
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Use code <strong className="text-gold font-bold">GLOW25</strong> for 25% off</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputPromo("GLOW25");
                        setAppliedPromo("GLOW25");
                        toast.success("Promo code GLOW25 applied! 25% discount unlocked.");
                      }}
                      className="text-[10px] text-primary hover:underline font-semibold"
                    >
                      Apply GLOW25 →
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button variant="spa" type="submit" className="w-full rounded-xl py-3 text-xs shadow-md">
                  Confirm Reservation Request ({computedPriceStr})
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Live Concierge Widget (Favicon Flower Badge Trigger) */}
      <LiveConciergeWidget onOpenBooking={handleOpenBooking} />
    </main>
  );
}
