import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";

type CounsellingType = "aiq_state" | "state_only";

type Plan = {
  name: string;
  price: string;
  badge?: string;
  cta: string;
  highlight: boolean;
  features: string[];
  waMessage: (type: CounsellingType) => string;
};

const WA_NUMBER = "916378489833";

function buildWaLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "₹999",
    cta: "Get Basic",
    highlight: false,
    features: [
      "Personalised preference list by expert (Round 1)",
      "Excel download of your list",
      "Community counselling session (Round 1) via WhatsApp",
    ],
    waMessage: (type) =>
      `Hi, I want to enrol in the *Basic Plan* for NEET counselling.\n\nCounselling Type: ${type === "aiq_state" ? "AIQ + State Quota" : "State Only"}\n\nMy details:\nName: \nNEET Rank: \nCategory: \nState: `,
  },
  {
    name: "Pro",
    price: "₹2999",
    badge: "Most Popular",
    cta: "Go Pro",
    highlight: true,
    features: [
      "Everything in Basic",
      "Personalised list for every counselling round",
      "Community sessions for all rounds",
      "1-on-1 counselling session with expert",
      "Priority WhatsApp support",
    ],
    waMessage: (type) =>
      `Hi, I want to enrol in the *Pro Plan* for NEET counselling.\n\nCounselling Type: ${type === "aiq_state" ? "AIQ + State Quota" : "State Only"}\n\nMy details:\nName: \nNEET Rank: \nCategory: \nState: `,
  },
  {
    name: "Elite",
    price: "₹4999",
    cta: "Make Me a Doctor 🚀",
    highlight: false,
    features: [
      "Everything in Pro",
      "We handle the entire counselling process for you",
      "We fill preferences on the official portal on your behalf",
      "Dedicated counsellor available on call",
      "Round-by-round tracking and updates",
      "You just sit back and wait for your seat",
    ],
    waMessage: (type) =>
      `Hi, I want to enrol in the *Elite Plan* for NEET counselling.\n\nCounselling Type: ${type === "aiq_state" ? "AIQ + State Quota" : "State Only"}\n\nMy details:\nName: \nNEET Rank: \nCategory: \nState: `,
  },
];

export function Plans() {
  const [counsellingType, setCounsellingType] = useState<CounsellingType>("aiq_state");

  return (
    <section id="plans" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-foreground/70">
            Transparent, one-time pricing. No subscriptions. No hidden fees.
          </p>
        </div>

        {/* Counselling type toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-full border-2 border-gold/40 bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setCounsellingType("aiq_state")}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                counsellingType === "aiq_state"
                  ? "bg-navy text-white shadow-md"
                  : "text-foreground/60 hover:text-navy"
              }`}
            >
              AIQ + State Quota
            </button>
            <button
              type="button"
              onClick={() => setCounsellingType("state_only")}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                counsellingType === "state_only"
                  ? "bg-navy text-white shadow-md"
                  : "text-foreground/60 hover:text-navy"
              }`}
            >
              State Only
            </button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl flex flex-col pt-10 pb-8 px-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-card-hover ${
                p.highlight
                  ? "bg-navy text-navy-foreground border-2 border-gold shadow-card-hover"
                  : "bg-card border border-border shadow-card"
              }`}
            >
              {/* Badge row — reserve pt-10 space on all cards for equal height */}
              {p.badge ? (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-gold-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                  {p.badge}
                </span>
              ) : null}

              {/* Plan name + price */}
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${p.highlight ? "text-gold" : "text-foreground/60"}`}>
                  {p.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`text-5xl font-bold ${p.highlight ? "text-gold" : "text-navy"}`}>
                    {p.price}
                  </span>
                  <span className={`text-sm ${p.highlight ? "text-navy-foreground/60" : "text-foreground/50"}`}>
                    one-time
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={18} className="mt-0.5 flex-shrink-0 text-gold" strokeWidth={2.5} />
                    <span className={`text-sm leading-relaxed ${p.highlight ? "text-navy-foreground/90" : "text-foreground/80"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA — WhatsApp link */}
              <a
                href={buildWaLink(p.waMessage(counsellingType))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-sm bg-gold text-gold-foreground transition-all duration-200 hover:brightness-110 hover:scale-[1.04] active:scale-[0.98] shadow-gold"
              >
                <MessageCircle size={16} />
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-foreground/50">
          After clicking, WhatsApp opens with your plan details pre-filled — just add your name, rank, category and state.
        </p>
      </div>
    </section>
  );
}
