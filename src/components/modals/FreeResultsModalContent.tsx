import { Lock, Pencil, Download } from "lucide-react";
import { DUMMY_COLLEGES } from "@/lib/constants";
import { useModals } from "@/lib/modals";
import { Navbar } from "@/components/landing/Navbar";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607z" />
    </svg>
  );
}

const LOCKED_COLLEGES = [
  "JIPMER Puducherry",
  "AIIMS Bhopal",
  "KGMU Lucknow",
];

export function FreeResultsModalContent({ onClose: _onClose }: { onClose: () => void }) {
  const modals = useModals();
  const input = modals.leadCtx;

  if (!input) {
    return (
      <div className="pt-32 text-center px-6">
        <p className="text-foreground/70">No data found. Please start again.</p>
        <button
          onClick={modals.openFreeForm}
          className="mt-6 rounded-full bg-gold px-6 py-3 font-bold text-gold-foreground"
        >
          Enter your details
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-16">
        {/* a) Compact summary card */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-card">
          <div className="text-sm text-foreground/80">
            <span className="font-semibold text-navy">Rank</span>{" "}
            {input.rank.toLocaleString("en-IN")}
            <span className="mx-2 text-foreground/30">·</span>
            <span className="font-semibold text-navy">{input.category}</span>
            <span className="mx-2 text-foreground/30">·</span>
            {input.state}
          </div>
          <button
            type="button"
            onClick={modals.openFreeForm}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold transition"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>

        {/* b) Rank context line */}
        <h1 className="mt-8 text-3xl sm:text-4xl font-bold text-navy">
          Top colleges you may be eligible for
        </h1>
        <p className="mt-2 text-foreground/70">
          All India Quota (AIQ) | {input.category} | Rank{" "}
          {input.rank.toLocaleString("en-IN")}
        </p>

        {/* c) College table */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-border shadow-card bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-gold">
                <th className="px-4 py-3 text-left font-semibold">S.No</th>
                <th className="px-4 py-3 text-left font-semibold">College Name</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-left font-semibold">Estd.</th>
                <th className="px-4 py-3 text-left font-semibold">Bond</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_COLLEGES.map((c, i) => (
                <tr key={c.name} className={i % 2 === 0 ? "bg-card" : "bg-secondary/40"}>
                  <td className="px-4 py-3 font-medium text-navy">{i + 1}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.state}</td>
                  <td className="px-4 py-3">{c.estd}</td>
                  <td className="px-4 py-3">{c.bond}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* d) Blurred locked cards */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {LOCKED_COLLEGES.map((name) => (
            <div
              key={name}
              className="relative h-32 rounded-xl bg-secondary border border-border overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-base font-semibold text-navy/70 blur-[6px] select-none">
                {name}
              </div>
              <div className="absolute inset-0 backdrop-blur-md bg-card/40 flex flex-col items-center justify-center text-center px-4">
                <Lock className="text-navy mb-2" size={22} />
                <span className="text-xs font-medium text-foreground/70">
                  Unlock with Basic or Pro
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-center text-foreground/70">
          Your complete personalised preference list has{" "}
          <span className="font-semibold text-navy">50+ colleges</span> — built by our experts
          for your exact rank and category.
        </p>

        {/* e) Two action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => modals.openWhatsAppCapture(input)}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold px-6 py-3 font-bold text-gold hover:bg-gold hover:text-gold-foreground transition"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Send to WhatsApp
          </button>
          <button
            type="button"
            onClick={() => modals.openDownloadAuth(input)}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold px-6 py-3 font-bold text-gold hover:bg-gold hover:text-gold-foreground transition"
          >
            <Download size={18} />
            Download Sample Excel
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-foreground/50">
          Free · No payment needed
        </p>

        {/* f) Navy CTA box */}
        <div className="mt-12 rounded-2xl bg-navy text-navy-foreground p-7 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gold">
            Get your complete list in 24 hours
          </h2>
          <p className="mt-3 text-sm text-navy-foreground/80">
            Counselling rounds fill fast — don't risk a wrong choice.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => modals.openPurchase({ plan: "basic", ctx: input })}
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition"
            >
              Get Basic — ₹999
            </button>
            <button
              type="button"
              onClick={() => modals.openPurchase({ plan: "pro", ctx: input })}
              className="inline-flex items-center justify-center rounded-full border-2 border-gold px-7 py-3.5 font-bold text-gold hover:bg-gold hover:text-gold-foreground transition"
            >
              Go Pro — ₹2999
            </button>
          </div>
          <p className="mt-5 text-xs text-navy-foreground/70">
            One-time payment · No subscription · Expert-built within 24 hours
          </p>
        </div>
      </main>
    </div>
  );
}
