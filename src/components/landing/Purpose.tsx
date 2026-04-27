import { Target, BarChart3, Handshake } from "lucide-react";

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
  return (
    <section id="purpose" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">Why Prep2Seat?</h2>
          <p className="mt-4 text-lg text-foreground/70">
            Counselling is where most NEET journeys go wrong. We fix that.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-t-4 border-gold"
            >
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center mb-5">
                <Icon className="text-navy" size={24} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
              <p className="text-foreground/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
