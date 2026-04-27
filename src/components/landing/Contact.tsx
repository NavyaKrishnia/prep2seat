import { Mail, MessageCircle } from "lucide-react";

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

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-base font-bold text-white hover:brightness-105 active:scale-[0.98] transition shadow-card"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
          <a
            href="mailto:hello@prep2seat.com"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy px-7 py-4 text-base font-bold text-navy hover:bg-navy hover:text-navy-foreground transition"
          >
            <Mail size={20} />
            Send us an Email
          </a>
        </div>

        <div className="mt-10 inline-flex flex-col items-center gap-2">
          <a
            href="mailto:hello@prep2seat.com"
            className="text-lg font-semibold text-navy hover:text-gold transition"
          >
            hello@prep2seat.com
          </a>
          <p className="text-sm text-foreground/60">
            We typically respond within a few hours.
          </p>
        </div>
      </div>
    </section>
  );
}
