import { Star, Quote } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const testimonials = [
  {
    quote: "I was completely lost after my NEET result. Prep2Seat's expert built my entire preference list and I got into my first choice government college.",
    name: "Priya S.",
    detail: "MBBS 2024, Tamil Nadu",
  },
  {
    quote: "The 1-on-1 session cleared every doubt I had about AIQ vs state quota. Worth every rupee.",
    name: "Arjun M.",
    detail: "MBBS 2024, Maharashtra",
  },
  {
    quote: "Got my preference list within 24 hours. The community session before Round 2 helped me stay calm and make the right choice.",
    name: "Sneha R.",
    detail: "MBBS 2024, Delhi",
  },
];

export function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section
      id="testimonials"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-navy">
            Students Who Found Their Seat
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Real students, real results.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`group relative rounded-2xl border border-border bg-card p-8 shadow-card flex flex-col
                transition-all duration-700 hover:-translate-y-2 hover:shadow-card-hover hover:border-gold/30
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
            >
              {/* Gold quote mark */}
              <Quote
                size={32}
                className="text-gold/30 mb-4 transition-all duration-300 group-hover:text-gold/60 group-hover:scale-110"
                fill="currentColor"
              />

              <p className="text-sm md:text-base text-foreground/80 italic leading-relaxed flex-1">
                "{t.quote}"
              </p>

              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="font-bold text-navy text-sm">{t.name}</p>
                <p className="text-xs text-foreground/55 mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
