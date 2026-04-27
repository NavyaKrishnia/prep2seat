const steps = [
  { n: "1", title: "Enter Your Details", desc: "Share your NEET rank, score, state and category." },
  { n: "2", title: "Choose Your Plan", desc: "Pick the plan that fits your counselling needs." },
  { n: "3", title: "Get Your List", desc: "Our experts build your personalised preference list within 24 hours." },
  { n: "4", title: "Submit & Secure Your Seat", desc: "Download your Excel list and submit it with confidence." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-navy">How It Works</h2>
          <p className="mt-4 text-lg text-foreground/70">Four simple steps from your rank to your seat.</p>
        </div>

        <div className="mt-16 relative">
          {/* Dotted connector */}
          <div
            className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, var(--gold) 0 8px, transparent 8px 18px)",
            }}
            aria-hidden="true"
          />
          <div className="grid md:grid-cols-4 gap-10 md:gap-6 relative">
            {steps.map((s) => (
              <div key={s.n} className="text-center md:text-left">
                <div className="relative mx-auto md:mx-0 w-16 h-16 rounded-full bg-navy text-navy-foreground flex items-center justify-center text-2xl font-bold shadow-card">
                  {s.n}
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-foreground/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
