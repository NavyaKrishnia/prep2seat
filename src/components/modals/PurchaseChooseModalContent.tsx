import { Check, MessageCircle } from "lucide-react";
import { downloadSampleExcel, type LeadCtx } from "@/lib/sample-download";
import { useAuthSession } from "@/lib/session";
import { toast } from "sonner";

const WA_NUMBER = "916378489833";
const SUPPORT_WA = `https://wa.me/${WA_NUMBER}`;

function buildWaLink(planName: string) {
  const msg = `Hi, I want to enrol in the *${planName} Plan* for NEET counselling.\n\nMy details:\nName: \nNEET Rank: \nCategory: \nState: `;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607z" />
    </svg>
  );
}

const allPlans = [
  {
    key: "basic",
    name: "Basic",
    price: "₹999",
    highlight: false,
    features: [
      "Personalised preference list (Round 1)",
      "Expert-reviewed for your rank",
      "Excel download, ready in 24 hours",
      "Community counselling session (Round 1)",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹2999",
    badge: "Most Popular",
    highlight: true,
    features: [
      "Everything in Basic",
      "Lists for every counselling round",
      "Community sessions for all rounds",
      "1-on-1 mentorship session",
      "Priority WhatsApp support",
    ],
  },
  {
    key: "elite",
    name: "Elite",
    price: "₹4999",
    highlight: false,
    features: [
      "Everything in Pro",
      "We handle the entire counselling process",
      "We fill preferences on official portal",
      "Dedicated counsellor on call",
      "You just sit back and wait for your seat",
    ],
  },
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
  const session = useAuthSession();

  async function handleSampleDownload() {
    if (!ctx) return;
    try {
      await downloadSampleExcel(ctx, session.whatsappNumber);
      toast.success("Downloading your sample list...");
      onClose();
    } catch {
      toast.error("Download failed. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy">Choose Your Plan</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Expert-built within 24 hours · One-time payment · No subscription
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {allPlans.map((p) => (
          <div
            key={p.key}
            className={`relative rounded-xl flex flex-col pt-8 pb-6 px-5 border ${
              p.highlight
                ? "bg-navy text-navy-foreground border-gold"
                : "bg-card border-border"
            }`}
          >
            {p.badge && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-gold-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                {p.badge}
              </span>
            )}

            <h3 className={`text-xs font-bold uppercase tracking-wider ${p.highlight ? "text-gold" : "text-foreground/50"}`}>
              {p.name}
            </h3>
            <p className={`mt-2 text-3xl font-bold ${p.highlight ? "text-gold" : "text-navy"}`}>
              {p.price}
            </p>

            <ul className="mt-4 space-y-2 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 flex-shrink-0 text-gold" strokeWidth={2.5} />
                  <span className={`text-xs leading-relaxed ${p.highlight ? "text-navy-foreground/80" : "text-foreground/70"}`}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={buildWaLink(p.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold bg-gold text-gold-foreground hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-gold"
            >
              <MessageCircle size={13} />
              Enrol via WhatsApp
            </a>
          </div>
        ))}
      </div>

      {sampleAvailable && ctx && (
        <p className="text-center text-xs text-foreground/50">
          <button
            type="button"
            onClick={handleSampleDownload}
            className="underline hover:text-navy transition-colors"
          >
            Just download the sample list instead →
          </button>
        </p>
      )}

      <a
        href={SUPPORT_WA}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:brightness-105 active:scale-[0.98] transition shadow-card"
      >
        <WhatsAppIcon className="h-4 w-4 text-white" />
        Have questions? Chat with us on WhatsApp
      </a>
    </div>
  );
}
