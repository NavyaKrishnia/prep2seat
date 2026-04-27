const quick = [
  { href: "#home", label: "Home" },
  { href: "#plans", label: "Plans" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#contact", label: "Contact" },
];

const legal = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Refund Policy" },
  { href: "#", label: "Terms & Conditions" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-2xl font-bold text-gold">Prep2Seat</div>
            <p className="mt-2 text-navy-foreground/70 text-sm">From Rank to Seat.</p>
            <p className="mt-4 text-navy-foreground/60 text-sm leading-relaxed max-w-xs">
              India's smartest NEET counselling platform — expert-built preference lists for every aspiring doctor.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quick.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-navy-foreground/80 hover:text-gold text-sm transition">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-navy-foreground/80 hover:text-gold text-sm transition">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-foreground/10 text-center md:text-left text-sm text-navy-foreground/60">
          © 2025 Prep2Seat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
