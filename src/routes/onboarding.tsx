import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { INDIAN_STATES, CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({ meta: [{ title: "Complete your profile — Prep2Seat" }] }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [fullName, setFullName] = useState("");
  const [neetScore, setNeetScore] = useState("");
  const [airRank, setAirRank] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [pwd, setPwd] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("whatsapp_number, full_name")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (profile) {
        setWhatsapp(profile.whatsapp_number ?? "");
        if (profile.full_name) {
          // Already completed onboarding — go to dashboard
          navigate({ to: "/dashboard" });
          return;
        }
      }
      setAuthChecked(true);
    })();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const score = Number(neetScore);
    const rank = Number(airRank);
    if (!fullName.trim()) return setError("Full name is required");
    if (!score || score < 0 || score > 720) return setError("NEET score must be between 0 and 720");
    if (!rank || rank < 1) return setError("Please enter a valid AIR rank");
    if (!state) return setError("Please select your state");
    if (!category) return setError("Please select your category");
    if (!/^\d{10}$/.test(whatsapp)) return setError("WhatsApp number must be 10 digits");

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Session expired");
      const { error: updErr } = await supabase
        .from("student_profiles")
        .update({
          full_name: fullName.trim(),
          neet_score: score,
          air_rank: rank,
          state,
          category,
          pwd,
          whatsapp_number: whatsapp,
          email: email.trim() || null,
          roll_number: rollNumber.trim() || null,
        })
        .eq("user_id", userData.user.id);
      if (updErr) throw updErr;
      toast.success("Profile saved!");
      navigate({ to: "/dashboard" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not save profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center text-foreground/60">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-5 sm:px-8 py-5 border-b border-border">
        <Link to="/" className="text-xl font-bold text-navy">Prep2Seat</Link>
      </header>

      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-8">
        <div className="rounded-xl bg-whatsapp/15 border border-whatsapp/30 px-5 py-4 text-sm font-medium text-foreground">
          ✅ Payment successful! Tell us about yourself so our expert can start building your list.
        </div>

        <div className="mt-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Complete your profile</h1>
          <p className="mt-1 text-foreground/70">Your expert needs these details to personalise your list</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Full Name">
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} required />
          </Field>
          <Field label="NEET Score (out of 720)">
            <input type="number" min={0} max={720} value={neetScore} onChange={(e) => setNeetScore(e.target.value)} className={inputCls} required />
          </Field>
          <Field label="NEET All India Rank">
            <input type="number" min={1} value={airRank} onChange={(e) => setAirRank(e.target.value)} className={inputCls} required />
          </Field>
          <Field label="State of Domicile">
            <select value={state} onChange={(e) => setState(e.target.value)} className={inputCls} required>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} required>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3">
            <span className="text-sm font-medium">PwD (Person with Disability)</span>
            <button
              type="button"
              onClick={() => setPwd((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition ${pwd ? "bg-gold" : "bg-border"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${pwd ? "left-6" : "left-1"}`} />
            </button>
          </div>
          <Field label="WhatsApp Number — we'll contact you here for important updates">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Email Address" sub="Optional · Used to send your preference list">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="NEET Roll Number" sub="Optional">
            <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className={inputCls} />
          </Field>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </main>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gold";

function Field({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {sub && <p className="mt-1 text-xs text-foreground/60">{sub}</p>}
    </div>
  );
}
