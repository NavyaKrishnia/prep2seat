import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { sendMockOtp, verifyMockOtp, signUpOrSignInWithPhone } from "@/lib/auth-helpers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in — Prep2Seat" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) navigate({ to: "/dashboard" });
    })();
  }, [navigate]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) return setError("Enter a valid 10-digit number");
    sendMockOtp(phone);
    setStep("otp");
    toast.success("OTP sent! Use 1234 for demo.");
  }

  function handleOtpChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (!verifyMockOtp(phone, code)) return setError("Invalid OTP. For demo, use 1234.");
    setLoading(true);
    try {
      await signUpOrSignInWithPhone(phone);
      // Check if this phone has a paid profile
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sign in failed");
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("user_id, full_name")
        .eq("user_id", userData.user.id)
        .maybeSingle();
      if (!profile) {
        // No paid profile — they haven't purchased
        await supabase.auth.signOut();
        setError("No account found for this number. Please choose a plan to get started.");
        setLoading(false);
        return;
      }
      navigate({ to: profile.full_name ? "/dashboard" : "/onboarding" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 sm:px-8 py-5 border-b border-border">
        <Link to="/" className="text-xl font-bold text-navy">Prep2Seat</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-card p-7 sm:p-9">
          <h1 className="text-2xl font-bold text-navy">Sign in to Prep2Seat</h1>
          <p className="mt-1 text-sm text-foreground/70">Verify your WhatsApp number to continue</p>

          {step === "phone" ? (
            <form onSubmit={handleSend} className="mt-6">
              <label className="block text-sm font-medium mb-1.5">
                WhatsApp Number — we'll contact you here for important updates
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-secondary text-sm font-medium">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 rounded-r-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              <button type="submit" className="mt-6 w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition">Send OTP</button>
              <p className="mt-4 text-xs text-center text-foreground/60">
                Haven't purchased yet? <Link to="/" className="text-navy font-semibold">View plans</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="mt-6">
              <div className="flex justify-center gap-3">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !v && i > 0) otpRefs.current[i - 1]?.focus(); }}
                    className="h-14 w-14 text-center text-xl font-bold rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                ))}
              </div>
              {error && <p className="mt-3 text-sm text-destructive text-center">{error}</p>}
              <button disabled={loading} type="submit" className="mt-6 w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition disabled:opacity-60">
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
