import { useState } from "react";
import { Check, MessageCircle, Lock } from "lucide-react";

// ── Toggle types ─────────────────────────────────────────────────────────────
type Course = "mbbs" | "bds" | "ayush";
type Quota = "aiq_state" | "state_only";
type CollegeType = "govt" | "govt_private";

// ── WhatsApp ─────────────────────────────────────────────────────────────────
const WA_NUMBER = "916378489833";

function buildWaLink(planName: string, quota: Quota, course: Course, collegeType: CollegeType) {
  const quotaLabel = quota === "aiq_state" ? "AIQ + State Quota" : "State Only";
  const courseLabel = course === "mbbs" ? "MBBS" : course === "bds" ? "BDS" : "AYUSH";
  const typeLabel = collegeType === "govt" ? "Government Colleges" : "Government + Private Colleges";
  const msg = `Hi, I want to enrol in the *${planName} Plan* for NEET counselling.\n\nCourse: ${courseLabel}\nCounselling Type: ${quotaLabel}\nCollege Type: ${typeLabel}\n\nMy details:\nName: \nNEET Rank: \nCategory: \nState: `;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ── Plan data ─────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Basic",
    price: "₹999",
    highlight: false,
    badge: undefined as string | undefined,
    cta: "Get Basic",
    features: [
      "Personalised preference list by expert (Round 1)",
      "Excel download of your list",
      "Community counselling session (Round 1) via WhatsApp",
    ],
  },
  {
    name: "Pro",
    price: "₹2999",
    highlight: true,
    badge: "Most Popular",
    cta: "Go Pro",
    features: [
      "Everything in Basic",
      "Personalised list for every counselling round",
      "Community sessions for all rounds",
      "1-on-1 counselling session with expert",
      "Priority WhatsApp support",
    ],
  },
  {
    name: "Elite",
    price: "₹4999",
    highlight: false,
    badge: undefined as string | undefined,
    cta: "Make Me a Doctor 🚀",
    features: [
      "Everything in Pro",
      "We handle the entire counselling process for you",
      "We fill preferences on the official portal on your behalf",
      "Dedicated counsellor available on call",
      "Round-by-round tracking and updates",
      "You just sit back and wait for your seat",
    ],
  },
];

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; comingSoon?: boolean }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border-2 border-gold/30 bg-card p-1 shadow-sm gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={opt.comingSoon}
          onClick={() => !opt.comingSoon && onChange(opt.value)}
          className={`relative rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 ${
            opt.comingSoon
              ? "text-foreground/30 cursor-not-allowed pr-7"
              : value === opt.value
              ? "bg-navy text-white shadow-md"
              : "text-foreground/60 hover:text-navy"
          }`}
        >
          {opt.label}
          {opt.comingSoon && (
            <span className="absolute top-0.5 right-1.5 inline-flex items-center">
              <Lock size={9} className="text-foreground/30" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function Plans() {
  const [course, setCourse] = useState<Course>("mbbs");
  const [quota, setQuota] = useState<Quota>("aiq_state");
  const [collegeType, setCollegeType] = useState<CollegeType>("govt");

  // Only MBBS + Govt is available this year — everything else is coming soon
  const isAvailable = course === "mbbs" && collegeType === "govt";

  return (
    <section id="plans" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-foreground/70">
            Transparent, one-time pricing. No subscriptions. No hidden fees.
          </p>
        </div>

        {/* Three toggles */}
        <div className="mt-10 flex flex-col items-center gap-3">
          {/* Toggle 1 — Course */}
          <Toggle
            options={[
              { value: "mbbs" as Course, label: "MBBS" },
              { value: "bds" as Course, label: "BDS", comingSoon: true },
              { value: "ayush" as Course, label: "AYUSH", comingSoon: true },
            ]}
            value={course}
            onChange={setCourse}
          />
          {/* Toggle 2 — Quota */}
          <Toggle
            options={[
              { value: "aiq_state" as Quota, label: "AIQ + State" },
              { value: "state_only" as Quota, label: "State Only" },
            ]}
            value={quota}
            onChange={setQuota}
          />
          {/* Toggle 3 — College type */}
          <Toggle
            options={[
              { value: "govt" as CollegeType, label: "Government" },
              { value: "govt_private" as CollegeType, label: "Govt + Private", comingSoon: true },
            ]}
            value={collegeType}
            onChange={setCollegeType}
          />

          {/* Coming soon notice when non-MBBS or private selected */}
          {!isAvailable && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold text-navy">
              <Lock size={11} />
              This combination is coming soon — we're currently focused on MBBS Government colleges.
            </div>
          )}
        </div>

        {/* Plan cards */}
        <div className={`mt-12 grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch transition-opacity duration-300 ${!isAvailable ? "opacity-40 pointer-events-none select-none" : ""}`}>
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl flex flex-col pt-10 pb-8 px-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-card-hover ${
                p.highlight
                  ? "bg-navy text-navy-foreground border-2 border-gold shadow-card-hover"
                  : "bg-card border border-border shadow-card"
              }`}
            >
              {p.badge ? (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-gold-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                  {p.badge}
                </span>
              ) : null}

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

              <a
                href={buildWaLink(p.name, quota, course, collegeType)}
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
