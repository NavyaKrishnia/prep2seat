import { useEffect } from "react";
import { PhoneOtpForm } from "@/components/PhoneOtp";
import { useAuthSession } from "@/lib/session";
import { useModals } from "@/lib/modals";

export function DownloadAuthModalContent({
  onClose: _onClose,
  rank,
  state,
  category,
}: {
  onClose: () => void;
  rank: number;
  state: string;
  category: string;
}) {
  const session = useAuthSession();
  const modals = useModals();
  const ctx = { rank, state, category };

  // If already verified, skip OTP and go straight to purchase modal with sample available
  useEffect(() => {
    if (session.isVerified) {
      modals.openPurchase({ sampleAvailable: true, ctx });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleVerified(phone: string) {
    session.setVerified(phone);
    modals.openPurchase({ sampleAvailable: true, ctx });
  }

  if (session.isVerified) return null;

  return (
    <>
      <p className="text-xs font-medium text-foreground/50 mb-1">Step 1 of 2</p>
      <h2 className="text-2xl font-bold text-navy">One step to get your file</h2>
      <p className="mt-2 text-sm text-foreground/70">
        Enter your WhatsApp number to continue — we'll also keep you
        updated on counselling rounds.
      </p>
      <div className="mt-6">
        <PhoneOtpForm onVerified={handleVerified} ctaLabel="Send OTP" />
      </div>
    </>
  );
}
