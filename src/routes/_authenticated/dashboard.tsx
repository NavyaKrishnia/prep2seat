import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { PageFooterSections } from "@/components/PageFooterSections";
import { Download, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Prep2Seat" }] }),
  component: Dashboard,
});

type Profile = {
  user_id: string;
  full_name: string | null;
  air_rank: number | null;
  category: string | null;
  plan: "basic" | "pro";
  list_status: "pending" | "ready";
  list_file_path: string | null;
};

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("student_profiles")
        .select("user_id, full_name, air_rank, category, plan, list_status, list_file_path")
        .eq("user_id", userData.user.id)
        .maybeSingle();
      if (!data) {
        navigate({ to: "/" });
        return;
      }
      if (!data.full_name) {
        navigate({ to: "/onboarding" });
        return;
      }
      setProfile(data as Profile);
      setLoading(false);
    })();
  }, [navigate]);

  async function handleDownload() {
    if (!profile?.list_file_path) return;
    setDownloading(true);
    try {
      const { data, error } = await supabase.storage
        .from("preference-lists")
        .createSignedUrl(profile.list_file_path, 60);
      if (error || !data) throw error ?? new Error("Could not generate link");
      window.open(data.signedUrl, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader name={null} />
        <div className="flex items-center justify-center py-20 text-foreground/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader name={profile.full_name} />
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8 space-y-6">
        {/* Profile summary */}
        <div className="rounded-2xl bg-navy text-navy-foreground p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold">{profile.full_name}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Stat label="Rank" value={profile.air_rank?.toLocaleString("en-IN") ?? "—"} />
            <Stat label="Category" value={profile.category ?? "—"} />
            <Stat label="Plan" value={profile.plan === "pro" ? "Pro" : "Basic"} />
          </div>
        </div>

        {/* Preference list */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy">Your Preference List</h2>
          {profile.list_status === "pending" ? (
            <div className="mt-5">
              <div className="flex items-center gap-3 text-foreground/80">
                <Clock className="text-gold" size={20} />
                <p>
                  Our expert is building your personalised list. It will be ready within 24 hours of your purchase.
                </p>
              </div>
              <div className="mt-5 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gold animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <p className="text-foreground/80">✅ Your list is ready!</p>
              <button
                onClick={handleDownload}
                disabled={downloading || !profile.list_file_path}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition disabled:opacity-60"
              >
                <Download size={18} />
                {downloading ? "Preparing..." : "Download Your List (Excel)"}
              </button>
            </div>
          )}
        </div>

        {/* Community sessions */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy">Community Sessions</h2>
          <p className="mt-3 text-foreground/80">
            {profile.plan === "basic"
              ? "Your Round 1 community counselling session details will be shared on your WhatsApp number."
              : "You'll be added to our WhatsApp group for support across all rounds. We'll reach out to you shortly."}
          </p>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-navy-foreground/60">{label}: </span>
      <span className="font-semibold text-navy-foreground">{value}</span>
    </div>
  );
}
