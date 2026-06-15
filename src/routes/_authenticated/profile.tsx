import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { INDIAN_STATES, CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My profile — Prep2Seat" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    neet_score: "",
    air_rank: "",
    state: "",
    category: "",
    pwd: false,
    whatsapp_number: "",
    email: "",
    roll_number: "",
  });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", u.user.id)
        .maybeSingle();
      if (!data) {
        navigate({ to: "/" });
        return;
      }
      setForm({
        full_name: data.full_name ?? "",
        neet_score: data.neet_score?.toString() ?? "",
        air_rank: data.air_rank?.toString() ?? "",
        state: data.state ?? "",
        category: data.category ?? "",
        pwd: !!data.pwd,
        whatsapp_number: data.whatsapp_number ?? "",
        email: data.email ?? "",
        roll_number: data.roll_number ?? "",
      });
      setLoading(false);
    })();
  }, [navigate]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Session expired");
      const { error: err } = await supabase
        .from("student_profiles")
        .update({
          full_name: form.full_name.trim(),
          neet_score: Number(form.neet_score),
          air_rank: Number(form.air_rank),
          state: form.state,
          category: form.category,
          pwd: form.pwd,
          whatsapp_number: form.whatsapp_number,
          email: form.email.trim() || null,
          roll_number: form.roll_number.trim() || null,
        })
        .eq("user_id", u.user.id);
      if (err) throw err;
      toast.success("Profile updated");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Update failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader name={null} />
        <div className="py-20 text-center text-foreground/60">Loading...</div>
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader name={form.full_name} />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">My Profile</h1>
        <form onSubmit={handleSave} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input className={inputCls} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">NEET Score (/720)</label>
              <input type="number" min={0} max={720} className={inputCls} value={form.neet_score} onChange={(e) => setForm({ ...form, neet_score: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">AIR Rank</label>
              <input type="number" min={1} className={inputCls} value={form.air_rank} onChange={(e) => setForm({ ...form, air_rank: e.target.value })} required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">State</label>
              <select className={inputCls} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3">
            <span className="text-sm font-medium">PwD</span>
            <button type="button" onClick={() => setForm({ ...form, pwd: !form.pwd })} className={`relative h-7 w-12 rounded-full transition ${form.pwd ? "bg-gold" : "bg-border"}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${form.pwd ? "left-6" : "left-1"}`} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">WhatsApp Number — we'll contact you here for important updates</label>
            <input type="tel" inputMode="numeric" maxLength={10} className={inputCls} value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value.replace(/\D/g, "") })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <p className="mt-1 text-xs text-foreground/60">Optional · Used to send your preference list</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">NEET Roll Number</label>
            <input type="text" className={inputCls} value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} />
            <p className="mt-1 text-xs text-foreground/60">Optional</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={saving} type="submit" className="w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}
