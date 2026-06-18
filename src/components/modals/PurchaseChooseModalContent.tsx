import { Check } from "lucide-react";
import { useModals } from "@/lib/modals";
import { useAuthSession } from "@/lib/session";
import { downloadSampleExcel, type LeadCtx } from "@/lib/sample-download";
import { toast } from "sonner";

const SUPPORT_WHATSAPP = "https://wa.me/919999999999";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607z" />
    </svg>
  );
}

const BASIC_FEATURES = [
  "Personalised preference list (Round 1)",
  "Expert-reviewed for your rank",
  "Excel download, ready in 24 hours",
  "Community counselling session (Round 1)",
];

const PRO_FEATURES = [
  "Everything in Basic",
  "Lists for every counselling round",
  "Community sessions for all rounds",
  "1-on-1 mentorship session",
  "Priority WhatsApp support",
];

export function PurchaseChooseModalContent({
  onClose,
  sampleAvailable,
  ctx,
}: {
  onClose: () => void;
  sampleAvailable: boolean;
  ctx: LeadCtx | null;
}) {
  const modals = useModals();
  const session = useAuthSession();

  async function handleSampleDownload() {
    if (!ctx) return;
    try {
      await downloadSampleExcel(ctx, session.whatsappNumber);
      toast.success("Downloading your sample list...");
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Couldn't download right now. Try again.");
    }
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center">
        Choose Your Plan
      </h2>
      <p className="mt-2 text-sm text-foreground/70 text-center">
        Expert-built within 24 hours · One-time payment · No subscription
      </p>

      {sampleAvailable && ctx && (
        <div className="mt-5 rounded-lg bg-secondary/60 border border-border px-4 py-3 text-center text-sm text-foreground/70">
          Your sample list download is also ready — or get your complete personalised list below.
          <button
            type="button"
            onClick={handleSampleDownload}
            className="ml-2 text-navy font-semibold hover:underline"
          >
            Just download the sample →
          </button>
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {/* Basic */}
        <div className="relative rounded-xl border-2 border-gold bg-card p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy">Basic</h3>
          <p className="mt-2 text-4xl font-bold text-gold">₹999</p>
          <ul className="mt-4 space-y-2 flex-1">
            {BASIC_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="text-gold mt-0.5 shrink-0" size={16} strokeWidth={3} />
                <span className="text-foreground/85">{f}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => modals.openPurchasePayment("basic")}
            className="mt-5 w-full rounded-full bg-gold py-3 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
          >
            Get Basic — ₹999
          </button>
        </div>

        {/* Pro */}
        <div className="relative rounded-xl border-2 border-gold bg-navy text-navy-foreground p-5 flex flex-col">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold">Pro</h3>
          <p className="mt-2 text-4xl font-bold text-gold">₹2999</p>
          <ul className="mt-4 space-y-2 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="text-gold mt-0.5 shrink-0" size={16} strokeWidth={3} />
                <span className="text-navy-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => modals.openPurchasePayment("pro")}
            className="mt-5 w-full rounded-full bg-gold py-3 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
          >
            Go Pro — ₹2999
          </button>
        </div>
      </div>

      <a
        href={SUPPORT_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground/80 hover:border-[#25D366] hover:text-navy transition"
      >
        <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
        Have questions? Chat with us on WhatsApp
      </a>
    </div>
  );
}
