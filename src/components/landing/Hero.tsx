import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
      {/* Background shield motif */}
      <div className="pointer-events-none absolute right-[-8%] top-1/2 -translate-y-1/2 hidden lg:block opacity-[0.06] animate-pulse-slow">
        <svg width="580" height="580" viewBox="0 0 200 200" fill="none">
          <path d="M100 10 L180 40 V100 C180 145 145 180 100 195 C55 180 20 145 20 100 V40 Z"
            stroke="currentColor" strokeWidth="2" className="text-navy" />
          <path d="M100 35 L155 55 V100 C155 135 130 160 100 170 C70 160 45 135 45 100 V55 Z"
            stroke="currentColor" strokeWidth="1.5" className="text-navy" />
          <path d="M70 100 L92 122 L135 78" stroke="currentColor" strokeWidth="3"
            className="text-gold" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500"
            style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-navy mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              NEET 2025 Counselling • Now Open
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-navy leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-600"
            style={{ animationDelay: "80ms" }}
          >
            From Rank <span className="italic font-serif text-gold">to</span> Seat
          </h1>

          {/* Subheading */}
          <p
            className="mt-6 text-lg md:text-xl text-foreground/75 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600"
            style={{ animationDelay: "160ms" }}
          >
            India's smartest NEET counselling platform. Get a personalised college preference
            list built by experts — and walk into the right college with confidence.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-600"
            style={{ animationDelay: "240ms" }}
          >
            {/* Primary — scroll to plans */}
            <a
              href="#plans"
              className="order-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base sm:text-lg font-bold text-gold-foreground shadow-gold
                transition-all duration-200 hover:bg-navy hover:text-white hover:shadow-lg hover:scale-[1.04] active:scale-[0.97]"
            >
              Get Personalised List
            </a>

            {/* Secondary — see how it works */}
            <a
              href="#how-it-works"
              className="order-2 inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-navy/30 px-7 py-4 text-base font-bold text-navy
                transition-all duration-200 hover:border-navy hover:bg-navy hover:text-white hover:scale-[1.03] active:scale-[0.97]"
            >
              See How It Works <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Trust signals */}
          <div
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-foreground/60 animate-in fade-in duration-700"
            style={{ animationDelay: "360ms" }}
          >
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
