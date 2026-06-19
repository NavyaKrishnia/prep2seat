import { useEffect, useRef, useState } from "react";
import { Lock, Pencil, Download, X } from "lucide-react";
import { DUMMY_COLLEGES, INDIAN_STATES, CATEGORIES } from "@/lib/constants";
import { useModals } from "@/lib/modals";
import { PageFooterSections } from "@/components/PageFooterSections";

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

/** Slim navbar used only on the free-results view (FIX 2). */
function ResultsNavbar({
  onHome,
  onPurchase,
}: {
  onHome: () => void;
  onPurchase: () => void;
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        <button
          type="button"
          onClick={onHome}
          className="text-xl md:text-2xl font-bold text-navy tracking-tight"
        >
          Prep2Seat
        </button>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={onHome}
            className="text-sm font-medium text-foreground/80 hover:text-navy transition"
          >
            Home
          </button>
          <button
            type="button"
            onClick={onPurchase}
            className="inline-flex items-center justify-center rounded-full bg-gold px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
          >
            Get Personalised List →
          </button>
        </div>
      </nav>
    </header>
  );
}

function EditInline({
  rank,
  state,
  category,
  onClose,
  onSave,
}: {
  rank: number;
  state: string;
  category: string;
  onClose: () => void;
  onSave: (next: { rank: number; state: string; category: string }) => void;
}) {
  const [r, setR] = useState(String(rank));
  const [s, setS] = useState(state);
  const [c, setC] = useState(category);
  const [error, setError] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const rNum = Number(r);
    if (!rNum || rNum < 1) return setError("Please enter a valid rank");
    if (!s) return setError("Please select your state");
    if (!c) return setError("Please select your category");
    onSave({ rank: rNum, state: s, category: c });
  }

  return (
    <div
      ref={wrapRef}
      className="mt-2 rounded-xl border border-border bg-card p-5 shadow-card animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-navy">Edit your details</h3>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 hover:bg-secondary hover:text-navy transition"
        >
          <X size={16} />
        </button>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            NEET All India Rank
          </label>
          <input
            type="number"
            value={r}
            onChange={(e) => setR(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            State of Domicile
          </label>
          <select
            value={s}
            onChange={(e) => setS(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            required
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Category
          </label>
          <select
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            required
          >
            <option value="">Select category</option>
            {CATEGORIES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-gold py-3 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
        >
          Update Results
        </button>
      </form>
    </div>
  );
}

export function FreeResultsModalContent({ onClose }: { onClose: () => void }) {
  const modals = useModals();
  const input = modals.leadCtx;
  const [editing, setEditing] = useState(false);

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
      <ResultsNavbar
        onHome={onClose}
        onPurchase={() => modals.openPurchase({ ctx: input })}
      />

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-28 pb-16">
        {/* a) Compact summary card with inline edit */}
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
            onClick={() => setEditing((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold transition"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>

        {editing && (
          <EditInline
            rank={input.rank}
            state={input.state}
            category={input.category}
            onClose={() => setEditing(false)}
            onSave={(next) => {
              modals.setLeadCtx(next);
              setEditing(false);
            }}
          />
        )}

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

      {/* FIX 3: persistent footer sections */}
      <PageFooterSections />
    </div>
  );
}
