import { Target, BarChart3, Handshake } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const items = [
  {
    icon: Target,
    title: "Expert-Built Lists",
    desc: "Your preference list is personally crafted by counselling experts, not an algorithm.",
  },
  {
    icon: BarChart3,
    title: "Data-Backed Decisions",
    desc: "Built on 3 years of cutoff trends across all quotas and categories.",
  },
  {
    icon: Handshake,
    title: "Support Across Every Round",
    desc: "From Round 1 to Mop-up, we're with you at every step.",
  },
];

export function Purpose() {
  const [ref, inView] = useInView();

  return (
    <section
      id="why"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-navy">Why Prep2Seat?</h2>
          <p className="mt-4 text-lg text-foreground/70">
            Counselling is where most NEET journeys go wrong. We fix that.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-700 hover:-translate-y-2 hover:shadow-card-hover hover:border-gold/40
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 mb-5 transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-110">
                  <Icon size={24} className="text-navy" strokeWidth={1.75} />
                </div>
                <div className="w-8 h-0.5 bg-gold mb-4 transition-all duration-300 group-hover:w-12" />
                <h3 className="text-lg font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
