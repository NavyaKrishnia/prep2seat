import { MessageCircle } from "lucide-react";

// Email button and address kept in code for future SaaS use, not rendered.
// const EMAIL = "hello@prep2seat.com";

const waContactLink = `https://wa.me/916378489833?text=${encodeURIComponent("Hi, I have a question about Prep2Seat's NEET counselling plans.")}`;

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-navy">
          Have Questions? We're Here.
        </h2>
        <p className="mt-4 text-lg text-foreground/70">
          Reach out — we usually reply faster than you'd expect.
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href={waContactLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white hover:brightness-105 active:scale-[0.98] transition shadow-card"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
        </div>

        <p className="mt-6 text-sm text-foreground/50">
          We typically respond within a few hours.
        </p>
      </div>
    </section>
  );
}
