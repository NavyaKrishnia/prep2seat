import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { DUMMY_COLLEGES } from "@/lib/constants";

export const Route = createFileRoute("/free-results")({
  head: () => ({ meta: [{ title: "Your free college list — Prep2Seat" }] }),
  component: FreeResults,
});

type FreeInput = { rank: number; state: string; category: string };

function FreeResults() {
  const navigate = useNavigate();
  const [input, setInput] = useState<FreeInput | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("p2s_free_input");
    if (!raw) {
      navigate({ to: "/free-form" });
      return;
    }
    setInput(JSON.parse(raw));
  }, [navigate]);

  if (!input) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="px-5 sm:px-8 py-5 border-b border-border">
        <Link to="/" className="text-xl font-bold text-navy">Prep2Seat</Link>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy">
          Top colleges you may be eligible for
        </h1>
        <p className="mt-2 text-foreground/70">
          All India Quota (AIQ) | {input.category} | Rank {input.rank.toLocaleString("en-IN")}
        </p>

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
                <tr
                  key={c.name}
                  className={i % 2 === 0 ? "bg-card" : "bg-secondary/40"}
                >
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

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-32 rounded-xl bg-secondary border border-border overflow-hidden"
            >
              <div className="absolute inset-0 backdrop-blur-md bg-card/50 flex flex-col items-center justify-center text-center px-4">
                <Lock className="text-navy mb-2" size={22} />
                <span className="text-xs font-medium text-foreground/70">
                  Locked — Pro/Basic plan
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

        <div className="mt-10 rounded-2xl bg-navy text-navy-foreground p-7 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gold">
            Get your complete list in 24 hours
          </h2>
          <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/purchase/$plan"
              params={{ plan: "basic" }}
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition"
            >
              Get Basic — ₹999
            </Link>
            <Link
              to="/purchase/$plan"
              params={{ plan: "pro" }}
              className="inline-flex items-center justify-center rounded-full border-2 border-gold px-7 py-3.5 font-bold text-gold hover:bg-gold hover:text-gold-foreground transition"
            >
              Go Pro — ₹2999
            </Link>
          </div>
          <p className="mt-5 text-xs text-navy-foreground/70">
            One-time payment · No subscription · Expert-built within 24 hours
          </p>
        </div>
      </main>
    </div>
  );
}
