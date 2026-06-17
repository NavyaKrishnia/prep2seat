import { useState } from "react";
import { Modal } from "@/components/Modal";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/lib/session";
import { toast } from "sonner";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function SendWhatsAppModal({
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
  const session = useAuthSession();
  const [phone, setPhone] = useState(session.whatsappNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    setLoading(true);
    try {
      session.setVerified(phone);
      await supabase.from("leads").insert({
        whatsapp_number: `+91${phone}`,
        air_rank: rank,
        state,
        category,
        source: "whatsapp_cta",
      });
      const { error: fnErr } = await supabase.functions.invoke("send-whatsapp", {
        body: { whatsapp_number: `+91${phone}`, rank, category },
      });
      if (fnErr) throw fnErr;
      toast.success("Sent! Check your WhatsApp in a few seconds.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't send right now. Try again or contact us.", {
        action: {
          label: "Open WhatsApp",
          onClick: () => window.open("https://wa.me/919999999999", "_blank"),
        },
      });
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold text-navy">Get your list on WhatsApp</h2>
      <p className="mt-2 text-sm text-foreground/70">
        We'll send your sample preference list snapshot directly to your
        WhatsApp — instantly.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
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
          disabled={loading}
          className="w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="h-4 w-4 rounded-full border-2 border-gold-foreground/40 border-t-gold-foreground animate-spin" />
          )}
          {loading ? "Sending…" : session.isVerified ? "Send Now" : "Send Now"}
        </button>
      </form>
    </Modal>
  );
}
