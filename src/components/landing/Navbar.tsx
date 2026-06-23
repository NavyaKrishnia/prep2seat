import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#plans", label: "Plans" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="text-xl md:text-2xl font-bold text-navy tracking-tight hover:text-gold transition-colors duration-200"
        >
          Prep2Seat
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm font-medium text-foreground/70 hover:text-navy transition-all duration-200 hover:scale-[1.08] inline-block
                  after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#plans"
            className="group inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground shadow-gold
              transition-all duration-200 hover:bg-navy hover:text-white hover:shadow-md hover:scale-[1.04] active:scale-[0.97]"
          >
            Get Personalised List →
          </a>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="#plans"
            className="inline-flex items-center justify-center rounded-full bg-gold px-3.5 py-2 text-xs font-bold text-gold-foreground shadow-gold
              transition-all duration-200 hover:bg-navy hover:text-white active:scale-[0.97]"
          >
            Get Personalised List →
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 -mr-2 text-navy transition-transform duration-200 hover:scale-110"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border animate-in slide-in-from-top-2 duration-200">
          <ul className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-foreground/80 hover:text-navy hover:translate-x-1 transition-all duration-200"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-3 pb-1">
              <a
                href="#plans"
                onClick={() => setOpen(false)}
                className="block w-full text-center rounded-full bg-gold px-5 py-3 font-bold text-gold-foreground hover:bg-navy hover:text-white transition-all duration-200"
              >
                Get Personalised List →
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
