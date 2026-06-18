import { createContext, useCallback, useContext, useState } from "react";
import { Modal } from "@/components/Modal";
import { FreeFormModalContent } from "@/components/modals/FreeFormModalContent";
import { FreeResultsModalContent } from "@/components/modals/FreeResultsModalContent";
import { WhatsAppCaptureModalContent } from "@/components/modals/WhatsAppCaptureModalContent";
import { DownloadAuthModalContent } from "@/components/modals/DownloadAuthModalContent";
import { PurchaseChooseModalContent } from "@/components/modals/PurchaseChooseModalContent";
import { PurchaseModalContent } from "@/components/PurchaseModalContent";
import type { PlanKey } from "@/lib/constants";
import type { LeadCtx } from "@/lib/sample-download";

type ModalKind =
  | "none"
  | "free-form"
  | "free-results"
  | "whatsapp-capture"
  | "download-auth"
  | "purchase"
  | "purchase-payment";

type ModalsContextValue = {
  kind: ModalKind;
  leadCtx: LeadCtx | null;
  selectedPlan: PlanKey | null;
  sampleAvailable: boolean;
  openFreeForm: () => void;
  openFreeResults: (ctx?: LeadCtx) => void;
  openWhatsAppCapture: (ctx: LeadCtx) => void;
  openDownloadAuth: (ctx: LeadCtx) => void;
  openPurchase: (opts?: { plan?: PlanKey; sampleAvailable?: boolean; ctx?: LeadCtx }) => void;
  openPurchasePayment: (plan: PlanKey) => void;
  setLeadCtx: (ctx: LeadCtx) => void;
  close: () => void;
};

const ModalsContext = createContext<ModalsContextValue | null>(null);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<ModalKind>("none");
  const [leadCtx, setLeadCtxState] = useState<LeadCtx | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [sampleAvailable, setSampleAvailable] = useState(false);

  const close = useCallback(() => {
    setKind("none");
    setSampleAvailable(false);
    setSelectedPlan(null);
  }, []);

  const openFreeForm = useCallback(() => setKind("free-form"), []);

  const openFreeResults = useCallback((ctx?: LeadCtx) => {
    if (ctx) setLeadCtxState(ctx);
    setKind("free-results");
  }, []);

  const openWhatsAppCapture = useCallback((ctx: LeadCtx) => {
    setLeadCtxState(ctx);
    setKind("whatsapp-capture");
  }, []);

  const openDownloadAuth = useCallback((ctx: LeadCtx) => {
    setLeadCtxState(ctx);
    setKind("download-auth");
  }, []);

  const openPurchase = useCallback(
    (opts?: { plan?: PlanKey; sampleAvailable?: boolean; ctx?: LeadCtx }) => {
      if (opts?.ctx) setLeadCtxState(opts.ctx);
      if (opts?.plan) setSelectedPlan(opts.plan);
      setSampleAvailable(!!opts?.sampleAvailable);
      setKind("purchase");
    },
    [],
  );

  const openPurchasePayment = useCallback((plan: PlanKey) => {
    setSelectedPlan(plan);
    setKind("purchase-payment");
  }, []);

  const setLeadCtx = useCallback((ctx: LeadCtx) => setLeadCtxState(ctx), []);

  const value: ModalsContextValue = {
    kind,
    leadCtx,
    selectedPlan,
    sampleAvailable,
    openFreeForm,
    openFreeResults,
    openWhatsAppCapture,
    openDownloadAuth,
    openPurchase,
    openPurchasePayment,
    setLeadCtx,
    close,
  };

  return (
    <ModalsContext.Provider value={value}>
      {children}

      {kind === "free-form" && (
        <Modal onClose={close}>
          <FreeFormModalContent />
        </Modal>
      )}

      {kind === "free-results" && (
        <Modal onClose={close} variant="fullscreen" showClose>
          <FreeResultsModalContent onClose={close} />
        </Modal>
      )}

      {kind === "whatsapp-capture" && leadCtx && (
        <Modal onClose={close}>
          <WhatsAppCaptureModalContent onClose={close} {...leadCtx} />
        </Modal>
      )}

      {kind === "download-auth" && leadCtx && (
        <Modal onClose={close}>
          <DownloadAuthModalContent onClose={close} {...leadCtx} />
        </Modal>
      )}

      {kind === "purchase" && (
        <Modal onClose={close} variant="wide">
          <PurchaseChooseModalContent
            onClose={close}
            sampleAvailable={sampleAvailable}
            ctx={leadCtx}
          />
        </Modal>
      )}

      {kind === "purchase-payment" && selectedPlan && (
        <Modal onClose={close}>
          <PurchaseModalContent plan={selectedPlan} onClose={close} />
        </Modal>
      )}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  const ctx = useContext(ModalsContext);
  if (!ctx) throw new Error("useModals must be used within ModalsProvider");
  return ctx;
}
