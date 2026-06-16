import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { Modal } from "@/components/Modal";
import { PhoneOtpForm } from "@/components/PhoneOtp";
import { signUpOrSignInWithPhone } from "@/lib/auth-helpers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in — Prep2Seat" }] }),
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <>
      <LandingPage />
      <AuthModal />
    </>
  );
}

function AuthModal() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) navigate({ to: "/dashboard" });
    })();
  }, [navigate]);

  async function handleVerified(phone: string) {
    setError("");
    setLoading(true);
    try {
      await signUpOrSignInWithPhone(phone);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sign in failed");
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("user_id, full_name")
        .eq("user_id", userData.user.id)
        .maybeSingle();
      if (!profile) {
        await supabase.auth.signOut();
        setError("No account found for this number. Please choose a plan to get started.");
        setLoading(false);
        throw new Error("No account found for this number.");
      }
      toast.success("Signed in!");
      navigate({ to: profile.full_name ? "/dashboard" : "/onboarding" });
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  return (
    <Modal>
      <h1 className="text-2xl font-bold text-navy">Sign in to Prep2Seat</h1>
      <p className="mt-1 text-sm text-foreground/70">
        Verify your WhatsApp number to continue
      </p>
      <div className="mt-6">
        <PhoneOtpForm onVerified={handleVerified} loadingExternal={loading} />
      </div>
      {error && (
        <p className="mt-4 text-xs text-center text-foreground/60">
          Haven't purchased yet?{" "}
          <Link to="/" className="text-navy font-semibold">
            View plans
          </Link>
        </p>
      )}
    </Modal>
  );
}
