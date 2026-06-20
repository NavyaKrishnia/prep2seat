import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Check, Pencil } from "lucide-react";
import { sendOtp, verifyOtpAndSignIn } from "@/lib/auth-otp";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607z" />
    </svg>
  );
}

export type PhoneOtpFormHandle = { backToPhone: () => void };
export type PhoneOtpStep = "phone" | "otp" | "verified-confirm";

export const PhoneOtpForm = forwardRef<
  PhoneOtpFormHandle,
  {
    onVerified: (phone: string) => void | Promise<void>;
    ctaLabel?: string;
    loadingExternal?: boolean;
    initialVerifiedPhone?: string;
    onStepChange?: (step: PhoneOtpStep) => void;
  }
>(function PhoneOtpForm(
  {
    onVerified,
    ctaLabel = "Send OTP",
    loadingExternal = false,
    initialVerifiedPhone = "",
    onStepChange,
  },
  ref,
) {
  const [phone, setPhone] = useState(initialVerifiedPhone);
  const [confirmingVerified, setConfirmingVerified] = useState(
    !!initialVerifiedPhone,
  );
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!otpSent) return;
    setResendIn(15);
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    setTimeout(() => otpRef.current?.focus(), 250);
    return () => clearInterval(id);
  }, [otpSent]);

  // Emit current step
  useEffect(() => {
    const step: PhoneOtpStep = otpSent
      ? "otp"
      : confirmingVerified
        ? "verified-confirm"
        : "phone";
    onStepChange?.(step);
  }, [otpSent, confirmingVerified, onStepChange]);

  useImperativeHandle(ref, () => ({
    backToPhone: () => {
      setOtpSent(false);
      setOtp("");
      setError("");
    },
  }));

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    setSending(true);
    try {
      await sendOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setSending(false);
    }
  }

  async function tryVerify(code: string) {
    if (code.length !== 6) return;
    if (verifying || loadingExternal) return;
    setVerifying(true);
    setError("");
    try {
      await verifyOtpAndSignIn(phone, code);
      await onVerified(phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setOtp("");
      setVerifying(false);
    }
  }

  function onOtpChange(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    if (digits.length === 6) tryVerify(digits);
  }

  async function handleResend() {
    if (resendIn > 0 || sending) return;
    setOtp("");
    setError("");
    setSending(true);
    try {
      await sendOtp(phone);
      setResendIn(15);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend");
    } finally {
      setSending(false);
    }
  }

  async function handleProceedVerified(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    setVerifying(true);
    try {
      await onVerified(phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setVerifying(false);
    }
  }

  function useDifferentNumber() {
    setConfirmingVerified(false);
    setPhone("");
    setError("");
  }

  const busy = verifying || loadingExternal;

  // Pre-verified confirm step
  if (confirmingVerified && !otpSent) {
    return (
      <form onSubmit={handleProceedVerified} className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            WhatsApp number — make sure this is correct
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-secondary text-sm font-medium text-foreground/60">
              +91
            </span>
            <div className="flex-1 relative">
              <input
                type="tel"
                value={phone}
                readOnly
                aria-readonly="true"
                className="w-full rounded-r-lg border border-input bg-muted/60 px-4 py-3 pr-11 cursor-not-allowed text-foreground/80 focus:outline-none"
              />
              <button
                type="button"
                onClick={useDifferentNumber}
                aria-label="Use a different number"
                className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-gold hover:bg-gold/10 transition"
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-2.5 py-1 text-[11px] font-semibold text-[#1ea34d]">
            <Check size={12} strokeWidth={3} /> Verified
          </div>
          <p className="mt-2 text-xs text-foreground/60">
            This should be your WhatsApp number — we'll send updates here
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition disabled:opacity-70"
        >
          {busy ? "Please wait…" : "Proceed →"}
        </button>
      </form>
    );
  }

  if (!otpSent) {
    return (
      <form onSubmit={handleSend} className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            WhatsApp number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-secondary text-sm font-medium">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="10-digit mobile number"
              className="flex-1 rounded-r-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="btn-gold w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition disabled:opacity-70"
        >
          {sending ? "Sending…" : ctaLabel}
        </button>
      </form>
    );
  }

  function focusOtp() {
    otpRef.current?.focus();
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Enter the 6-digit OTP
        </label>
        <p className="text-xs text-foreground/60 mb-3">
          Sent to <span className="font-semibold text-navy">+91 {phone}</span>
        </p>
        <div className="relative" onClick={focusOtp}>
          <input
            ref={otpRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            name="otp"
            maxLength={6}
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            onPaste={(e) => {
              const t = e.clipboardData.getData("text");
              if (/\d/.test(t)) {
                e.preventDefault();
                onOtpChange(t);
              }
            }}
            disabled={busy}
            className="absolute inset-0 w-full h-full opacity-0 text-center tracking-[2em] cursor-pointer"
            aria-label="OTP"
          />
          <div className="flex justify-center gap-3 pointer-events-none">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const active = otp.length === i && !busy;
              return (
                <div
                  key={i}
                  className={`h-14 w-14 flex items-center justify-center text-xl font-bold rounded-lg border bg-background ${active ? "border-gold ring-2 ring-gold/30" : "border-input"}`}
                >
                  {otp[i] ?? ""}
                </div>
              );
            })}
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive text-center">{error}</p>}
        {busy && (
          <p className="mt-3 text-sm text-foreground/60 text-center">Verifying…</p>
        )}
        <div className="mt-4 flex items-center justify-end text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendIn > 0}
            className="text-foreground/60 hover:text-navy disabled:text-foreground/30 disabled:cursor-not-allowed"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
});
