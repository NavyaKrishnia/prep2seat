import { useEffect, useRef, useState } from "react";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function PhoneOtpForm({
  onVerified,
  ctaLabel = "Send OTP",
  loadingExternal = false,
}: {
  onVerified: (phone: string) => void | Promise<void>;
  ctaLabel?: string;
  loadingExternal?: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!otpSent) return;
    setResendIn(30);
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    setTimeout(() => otpRef.current?.focus(), 250);
    return () => clearInterval(id);
  }, [otpSent]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    // Mock send — sessionStorage tracking happens via auth-helpers if needed
    if (typeof window !== "undefined") {
      sessionStorage.setItem("p2s_pending_otp", phone);
    }
    setOtpSent(true);
  }

  async function tryVerify(code: string) {
    if (code.length !== 4) return;
    if (verifying || loadingExternal) return;
    setVerifying(true);
    setError("");
    try {
      // Mock: accept any 4-digit code
      await onVerified(phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setVerifying(false);
    }
    // Keep verifying true on success — parent will unmount or advance
  }

  function onOtpChange(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    setOtp(digits);
    if (digits.length === 4) {
      tryVerify(digits);
    }
  }

  function handleResend() {
    if (resendIn > 0) return;
    setOtp("");
    setError("");
    setResendIn(30);
  }

  function changeNumber() {
    setOtpSent(false);
    setOtp("");
    setError("");
  }

  const busy = verifying || loadingExternal;

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
            readOnly={otpSent}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="10-digit mobile number"
            className={`flex-1 rounded-r-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold ${otpSent ? "bg-secondary text-foreground/70" : ""}`}
            required
          />
          {otpSent && (
            <button
              type="button"
              onClick={changeNumber}
              className="ml-2 text-xs font-semibold text-navy hover:underline whitespace-nowrap"
            >
              Change
            </button>
          )}
        </div>
      </div>

      {!otpSent && error && <p className="text-sm text-destructive">{error}</p>}

      {!otpSent ? (
        <button
          type="submit"
          className="w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
        >
          {ctaLabel}
        </button>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-medium text-foreground mb-2">
            Enter the 4-digit OTP
          </label>
          <div className="relative">
            <input
              ref={otpRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={otp}
              onChange={(e) => onOtpChange(e.target.value)}
              disabled={busy}
              className="absolute inset-0 w-full h-full opacity-0 text-center tracking-[2em]"
              aria-label="OTP"
            />
            <div className="flex justify-center gap-3 pointer-events-none">
              {[0, 1, 2, 3].map((i) => {
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
          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={changeNumber}
              className="text-navy font-semibold hover:underline"
            >
              ← Change number
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0}
              className="text-foreground/60 hover:text-navy disabled:text-foreground/30 disabled:cursor-not-allowed"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
            </button>
          </div>
          <p className="mt-3 text-xs text-center text-foreground/50">
            Demo: enter any 4 digits
          </p>
        </div>
      )}
    </form>
  );
}
