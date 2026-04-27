import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
      {/* Subtle shield motif */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 -translate-y-1/2 hidden lg:block opacity-[0.07]">
        <svg width="560" height="560" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 10 L180 40 V100 C180 145 145 180 100 195 C55 180 20 145 20 100 V40 Z"
            stroke="currentColor"
            strokeWidth="2"
            className="text-navy"
          />
          <path
            d="M100 35 L155 55 V100 C155 135 130 160 100 170 C70 160 45 135 45 100 V55 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-navy"
          />
          <path d="M70 100 L92 122 L135 78" stroke="currentColor" strokeWidth="3" className="text-gold" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-navy mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            NEET 2025 Counselling • Now Open
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-navy leading-[1.05] tracking-tight">
            From Rank <span className="italic font-serif text-gold">to</span> Seat
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/75 max-w-2xl leading-relaxed">
            India's smartest NEET counselling platform. Get a personalised college preference
            list built by experts — and walk into the right college with confidence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#plans"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-base font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
            >
              Get Your Free List
              <ArrowRight size={18} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border-2 border-navy px-7 py-4 text-base font-bold text-navy hover:bg-navy hover:text-navy-foreground transition"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-foreground/60">
            <div><span className="font-bold text-navy">3+ years</span> of cutoff data</div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div><span className="font-bold text-navy">24-hour</span> turnaround</div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div><span className="font-bold text-navy">Expert-built</span>, not AI</div>
          </div>
        </div>
      </div>
    </section>
  );
}
