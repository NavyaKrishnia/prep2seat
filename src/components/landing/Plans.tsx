import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useModals } from "@/lib/modals";

type Plan = {
  name: string;
  price: string;
  features: string[];
  cta: string;
  variant: "free" | "basic" | "pro";
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    variant: "free",
    cta: "Get Started Free",
    features: [
      "NEET profile creation",
      "View top 5 college preferences for your state",
      "Access to general counselling info",
    ],
  },
  {
    name: "Basic",
    price: "₹999",
    variant: "basic",
    cta: "Get Basic",
    features: [
      "Everything in Free",
      "1 personalised preference list by expert (Round 1)",
      "Excel download of your list",
      "Community counselling session (Round 1) via WhatsApp",
    ],
  },
  {
    name: "Pro",
    price: "₹2999",
    variant: "pro",
    cta: "Go Pro",
    badge: "Most Popular",
    features: [
      "Everything in Basic",
      "Personalised list for every counselling round",
      "Community sessions for all rounds",
      "1-on-1 counselling session with expert",
      "Priority WhatsApp support",
    ],
  },
];

export function Plans() {
  const modals = useModals();
  return (
    <section id="plans" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-foreground/70">
            Transparent, one-time pricing. No subscriptions. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((p) => {
            const isPro = p.variant === "pro";
            const isBasic = p.variant === "basic";
            return (
              <div
                key={p.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  isPro
                    ? "bg-navy text-navy-foreground shadow-card-hover md:-translate-y-2 md:scale-[1.03] border-2 border-gold"
                    : isBasic
                    ? "bg-card border-2 border-gold shadow-card"
                    : "bg-card border border-border shadow-card"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}

                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isPro ? "text-gold" : "text-foreground/60"}`}>
                    {p.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${isPro ? "text-gold" : "text-navy"}`}>
                      {p.price}
                    </span>
                    {p.price !== "₹0" && (
                      <span className={`text-sm ${isPro ? "text-navy-foreground/60" : "text-foreground/50"}`}>
                        one-time
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-8 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className={`mt-0.5 flex-shrink-0 ${isPro ? "text-gold" : "text-gold"}`}
                        strokeWidth={2.5}
                      />
                      <span className={`text-sm leading-relaxed ${isPro ? "text-navy-foreground/90" : "text-foreground/80"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {p.variant === "free" ? (
                  <Link
                    to="/free-form"
                    className="mt-8 w-full text-center rounded-full py-3.5 font-bold text-sm transition active:scale-[0.98] border-2 border-gold text-navy hover:bg-gold hover:text-gold-foreground"
                  >
                    {p.cta}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => modals.openPurchase(p.variant as "basic" | "pro")}
                    className="mt-8 w-full text-center rounded-full py-3.5 font-bold text-sm transition active:scale-[0.98] bg-gold text-gold-foreground hover:brightness-105 shadow-gold"
                  >
                    {p.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
