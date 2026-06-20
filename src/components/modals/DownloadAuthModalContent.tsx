import { useRef, useState } from "react";
import { PhoneOtpForm, type PhoneOtpFormHandle, type PhoneOtpStep } from "@/components/PhoneOtp";
import { useAuthSession } from "@/lib/session";
import { useModals } from "@/lib/modals";
import { Modal } from "@/components/Modal";

export function DownloadAuthModal({
  rank,
  state,
  category,
  onClose,
}: {
  rank: number;
  state: string;
  category: string;
  onClose: () => void;
}) {
  const session = useAuthSession();
  const modals = useModals();
  const ctx = { rank, state, category };
  const otpRef = useRef<PhoneOtpFormHandle>(null);
  const [step, setStep] = useState<PhoneOtpStep>(
    session.isVerified ? "verified-confirm" : "phone",
  );

  async function handleVerified(phone: string) {
    session.setVerified(phone);
    modals.openPurchase({ sampleAvailable: true, ctx });
  }

  const onBack = step === "otp" ? () => otpRef.current?.backToPhone() : onClose;

  return (
    <Modal onClose={onClose} onBack={onBack}>
      <p className="text-xs font-medium text-foreground/50 mb-1">
        {step === "otp" ? "Step 2 of 2" : "Step 1 of 2"}
      </p>
      <h2 className="text-2xl font-bold text-navy">
        {session.isVerified ? "Almost there" : "One step to get your file"}
      </h2>
      <p className="mt-2 text-sm text-foreground/70">
        {session.isVerified
          ? "Confirm your WhatsApp number to continue — we'll send your download link and counselling updates here."
          : "Enter your WhatsApp number to continue — we'll also keep you updated on counselling rounds."}
      </p>
      <div className="mt-6">
        <PhoneOtpForm
          ref={otpRef}
          onVerified={handleVerified}
          ctaLabel="Send OTP"
          initialVerifiedPhone={session.isVerified ? session.whatsappNumber : ""}
          onStepChange={setStep}
        />
      </div>
    </Modal>
  );
}
