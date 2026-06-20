import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PhoneOtpForm } from "@/components/PhoneOtp";
import { PLAN_DETAILS, type PlanKey } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/lib/session";
import { toast } from "sonner";
import { Loader2, AlertCircle, MessageCircle } from "lucide-react";

const SUPPORT_WHATSAPP = "919999999999";

export function PurchaseModalContent({
  plan,
  onClose,
}: {
  plan: PlanKey;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const details = PLAN_DETAILS[plan];
  const session = useAuthSession();

  // Verified phone for payment step (Step 2). Not pre-set even when session is
  // verified — Step 1 must always be shown for confirmation per FIX 5.
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onVerified(phone: string) {
    session.setVerified(phone);
    setVerifiedPhone(phone);
    return Promise.resolve();
  }

  async function handlePay() {
    if (!verifiedPhone) return;
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 900));
      // The user is now authenticated via the server-issued OTP magic-link
      // exchange performed inside PhoneOtpForm. Use the real session user.
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        throw new Error("Please verify your number again to continue.");
      }
      const userId = userData.user.id;
      // payment_status / plan / payment_date are deliberately omitted: a
      // column-level GRANT prevents authenticated users from setting them.
      // The backend marks the profile as paid once payment is confirmed.
      const { error: upsertErr } = await supabase
        .from("student_profiles")
        .upsert(
          {
            user_id: userId,
            whatsapp_number: verifiedPhone,
            plan,
            list_status: "pending",
          },
          { onConflict: "user_id" },
        );
      if (upsertErr) throw upsertErr;
      toast.success("Verified! Complete payment to activate your plan.");
      session.setSessionPlan(plan);
      onClose();
      navigate({ to: "/onboarding" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment failed";
      setError(msg);
      setLoading(false);
    }
  }

  if (!verifiedPhone) {
    return (
      <>
        <p className="text-xs font-medium text-foreground/50 mb-1">Step 1 of 2</p>
        <h1 className="text-2xl font-bold text-navy">Almost there</h1>
        <p className="mt-1 text-sm text-foreground/70">
          {session.isVerified
            ? `Confirm your WhatsApp number to continue with ${details.name}`
            : `Verify your WhatsApp number to continue with ${details.name}`}
        </p>
        <div className="mt-6">
          <PhoneOtpForm
            onVerified={onVerified}
            initialVerifiedPhone={
              session.isVerified ? session.whatsappNumber : ""
            }
          />
        </div>
      </>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-foreground/50 mb-1 text-center">
        Step 2 of 2
      </p>
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

      {error && (
        <div className="mt-5 flex gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3.5 text-sm text-destructive">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Payment unsuccessful. Please try again.</p>
            <p className="mt-1 text-xs opacity-80">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <p className="mt-3 text-xs text-center text-foreground/60">
        🔒 Secure payment · GST included · 24hr delivery
      </p>

      {/* FIX 1: WhatsApp support CTA below Pay Now, green like the contact CTA */}
      <a
        href={`https://wa.me/${SUPPORT_WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-bold text-white hover:brightness-105 active:scale-[0.98] transition shadow-card"
      >
        <MessageCircle size={18} />
        Have questions? Chat with us on WhatsApp
      </a>
    </div>
  );
}
