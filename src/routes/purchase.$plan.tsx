import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PLAN_DETAILS, type PlanKey } from "@/lib/constants";
import { sendMockOtp, verifyMockOtp, signUpOrSignInWithPhone } from "@/lib/auth-helpers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/purchase/$plan")({
  head: () => ({ meta: [{ title: "Complete your purchase — Prep2Seat" }] }),
  component: PurchasePage,
});

type Step = "phone" | "otp" | "payment";

function PurchasePage() {
  const { plan } = Route.useParams();
  const navigate = useNavigate();
  const planKey = (plan === "pro" ? "pro" : "basic") as PlanKey;
  const details = PLAN_DETAILS[planKey];

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendIn, setResendIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "otp") return;
    setResendIn(30);
    const id = setInterval(() => {
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
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
    if (code.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }
    if (!verifyMockOtp(phone, code)) {
      setError("Invalid OTP. For demo, use 1234.");
      return;
    }
    setStep("payment");
  }

  function handleResend() {
    if (resendIn > 0) return;
    sendMockOtp(phone);
    setResendIn(30);
    toast.success("OTP re-sent! Use 1234 for demo.");
  }

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      // MOCK Razorpay — simulate latency then mark paid
      await new Promise((r) => setTimeout(r, 900));
      const userId = await signUpOrSignInWithPhone(phone);

      const { error: upsertErr } = await supabase
        .from("student_profiles")
        .upsert(
          {
            user_id: userId,
            whatsapp_number: phone,
            plan: planKey,
            payment_status: "paid",
            payment_date: new Date().toISOString(),
            list_status: "pending",
          },
          { onConflict: "user_id" },
        );
      if (upsertErr) throw upsertErr;

      toast.success("Payment successful!");
      navigate({ to: "/onboarding" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment failed";
      setError(msg);
      toast.error(msg);
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
          {step === "phone" && (
            <form onSubmit={handleSendOtp}>
              <h1 className="text-2xl font-bold text-navy">Almost there</h1>
              <p className="mt-1 text-sm text-foreground/70">
                Verify your WhatsApp number to continue
              </p>
              <label className="block mt-6 text-sm font-medium text-foreground mb-1.5">
                WhatsApp Number — we'll contact you here for important updates
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-secondary text-sm font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="flex-1 rounded-r-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition"
              >
                Send OTP
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerify}>
              <h1 className="text-2xl font-bold text-navy">Enter the 4-digit OTP</h1>
              <p className="mt-1 text-sm text-foreground/70">
                Sent to +91 {phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1$2$3").replace(/\d(?=\d{4})/g, "X")}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !v && i > 0) otpRefs.current[i - 1]?.focus();
                    }}
                    className="h-14 w-14 text-center text-xl font-bold rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                ))}
              </div>
              {error && <p className="mt-3 text-sm text-destructive text-center">{error}</p>}
              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0}
                className="mt-3 w-full text-sm text-foreground/60 hover:text-navy disabled:text-foreground/30 disabled:cursor-not-allowed"
              >
                {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
              </button>
            </form>
          )}

          {step === "payment" && (
            <div>
              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-foreground/60">
                  Your Plan
                </p>
                <h1 className="mt-1 text-3xl font-bold text-navy">{details.name}</h1>
                <p className="mt-2 text-4xl font-bold text-gold">{details.priceLabel}</p>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {details.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-gold">✓</span>
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              {error && <p className="mt-4 text-sm text-destructive text-center">{error}</p>}
              <button
                onClick={handlePay}
                disabled={loading}
                className="mt-7 w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition disabled:opacity-60"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
              <p className="mt-3 text-xs text-center text-foreground/60">
                🔒 Secure payment · GST included · 24hr delivery
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
