import { useInView } from "@/hooks/useInView";

const steps = [
  { n: "1", title: "Enter Your Details", desc: "Share your NEET rank, score, state and category." },
  { n: "2", title: "Choose Your Plan", desc: "Pick the plan that fits your counselling needs." },
  { n: "3", title: "Get Your List", desc: "Our experts build your personalised preference list within 24 hours." },
  { n: "4", title: "Submit & Secure Your Seat", desc: "Download your Excel list and submit it with confidence." },
];

export function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section
      id="how-it-works"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-secondary/40"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className={`max-w-2xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-navy">How It Works</h2>
          <p className="mt-4 text-lg text-foreground/70">Four simple steps from your rank to your seat.</p>
        </div>

        <div className="mt-16 relative">
          {/* Dotted connector — desktop only */}
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px border-t-2 border-dashed border-gold/30" />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`relative flex flex-col items-center text-center transition-all duration-700
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white text-xl font-bold shadow-card
                  transition-all duration-300 hover:bg-gold hover:text-gold-foreground hover:scale-110 hover:shadow-gold">
                  {s.n}
                </div>
                <h3 className="mt-5 text-base font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
