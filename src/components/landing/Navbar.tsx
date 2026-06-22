import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { useModals } from "@/lib/modals";

const WA_NUMBER = "916378489833";
const waPersonalisedLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in getting a personalised NEET college preference list.\n\nMy details:\nName: \nNEET Rank: \nCategory: \nState: ")}`;

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
  const modals = useModals();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#home" className="text-xl md:text-2xl font-bold text-navy tracking-tight">
          Prep2Seat
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-foreground/80 hover:text-navy transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {/* <button
            type="button"
            onClick={() => modals.openFreeForm()}
            className="inline-flex items-center justify-center rounded-full border-2 border-navy px-4 py-2 text-sm font-bold text-navy hover:bg-navy hover:text-navy-foreground transition"
          >
            Get Started Free
          </button> */}
          <a
            href={waPersonalisedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground shadow-gold hover:brightness-110 transition"
          >
            <MessageCircle size={14} />
            Get Personalised List →
          </a>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href={waPersonalisedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center justify-center gap-1 rounded-full bg-gold px-3.5 py-2 text-xs font-bold text-gold-foreground shadow-gold"
          >
            <MessageCircle size={12} />
            Get Personalised List →
          </a>
          <button aria-label="Toggle menu" onClick={() => setOpen((v) => !v)} className="p-2 -mr-2 text-navy">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-background border-t border-border">
          <ul className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-foreground/90 hover:text-navy">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <button
                type="button"
                onClick={() => { setOpen(false); modals.openFreeForm(); }}
                className="block w-full text-center rounded-full border-2 border-navy px-5 py-3 font-bold text-navy"
              >
                Get Started Free
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
