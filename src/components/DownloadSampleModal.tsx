import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Modal } from "@/components/Modal";
import { PhoneOtpForm } from "@/components/PhoneOtp";
import { supabase } from "@/integrations/supabase/client";
import { DUMMY_COLLEGES } from "@/lib/constants";
import { toast } from "sonner";
import { Check } from "lucide-react";

type Step = "otp" | "interstitial";

export function DownloadSampleModal({
  onClose,
  rank,
  state,
  category,
}: {
  onClose: () => void;
  rank: number;
  state: string;
  category: string;
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("otp");
  const [phone, setPhone] = useState("");

  async function handleVerified(verifiedPhone: string) {
    setPhone(verifiedPhone);
    setStep("interstitial");
  }

  async function downloadExcel() {
    const XLSX = await import("xlsx");
    const rows = DUMMY_COLLEGES.map((c, i) => ({
      "S.No": i + 1,
      "College Name": c.name,
      State: c.state,
      "Estd.": c.estd,
      Bond: c.bond,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 6 }, { wch: 38 }, { wch: 16 }, { wch: 8 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample List");
    XLSX.writeFile(wb, "Prep2Seat_Sample_Preference_List.xlsx");

    await supabase.from("leads").insert({
      whatsapp_number: `+91${phone}`,
      air_rank: rank,
      state,
      category,
      source: "excel_download",
    });

    toast.success("Downloading your sample list...");
    setTimeout(onClose, 400);
  }

  return (
    <Modal onClose={onClose}>
      {step === "otp" && (
        <>
          <h2 className="text-2xl font-bold text-navy">One step to get your file</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Enter your WhatsApp number to continue — we'll also keep you
            updated on counselling rounds.
          </p>
          <div className="mt-6">
            <PhoneOtpForm onVerified={handleVerified} ctaLabel="Send OTP" />
          </div>
        </>
      )}

      {step === "interstitial" && (
        <>
          <h2 className="text-2xl font-bold text-navy">
            Your sample list is ready ✓
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            But this is only 5 colleges.
          </p>

          <p className="mt-5 text-sm text-foreground/80 leading-relaxed">
            Your actual personalised list has <span className="font-semibold text-navy">50+ colleges</span> — handpicked by our expert counsellors for your exact rank, category, and competition. Most students who skip personalised counselling end up with a wrong college or lose a round.
          </p>

          <div className="mt-5 space-y-2.5">
            {[
              `Complete preference list personalised for Rank ${rank.toLocaleString("en-IN")}`,
              "Expert-reviewed and ready to submit in 24 hours",
              "Community counselling + 1-on-1 mentorship (Pro)",
            ].map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <Check className="text-gold mt-0.5 shrink-0" size={18} strokeWidth={3} />
                <span className="text-sm text-foreground">{line}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate({ to: "/purchase/$plan", params: { plan: "basic" } });
            }}
            className="mt-6 w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
          >
            Get My Complete List — ₹999
          </button>

          <button
            type="button"
            onClick={downloadExcel}
            className="mt-4 block w-full text-center text-sm text-foreground/60 hover:text-navy transition"
          >
            Continue with sample download →
          </button>
        </>
      )}
    </Modal>
  );
}
