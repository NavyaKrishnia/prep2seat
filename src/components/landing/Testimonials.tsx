import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I was completely lost after my NEET result. Prep2Seat's expert built my entire preference list and I got into my first choice government college.",
    name: "Priya S.",
    detail: "MBBS 2024, Tamil Nadu",
  },
  {
    quote:
      "The 1-on-1 session cleared every doubt I had about AIQ vs state quota. Worth every rupee.",
    name: "Arjun M.",
    detail: "MBBS 2024, Maharashtra",
  },
  {
    quote:
      "Got my preference list within 24 hours. The community session before Round 2 helped me stay calm and make the right choice.",
    name: "Sneha R.",
    detail: "MBBS 2024, Delhi",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">
            Students Who Found Their Seat
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Real stories from students we helped through counselling.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <Quote className="text-gold absolute top-6 right-6 opacity-40" size={36} fill="currentColor" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-gold" fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-foreground/85 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-border">
                <div className="font-bold text-navy">{t.name}</div>
                <div className="text-sm text-foreground/60">{t.detail}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
