import { createContext, useCallback, useContext, useState } from "react";
import { Modal } from "@/components/Modal";
import { FreeFormModalContent } from "@/components/modals/FreeFormModalContent";
import { FreeResultsModalContent } from "@/components/modals/FreeResultsModalContent";
import { WhatsAppCaptureModalContent } from "@/components/modals/WhatsAppCaptureModalContent";
import { DownloadAuthModal } from "@/components/modals/DownloadAuthModalContent";
import { PurchaseChooseModalContent } from "@/components/modals/PurchaseChooseModalContent";
import { PurchasePaymentModal } from "@/components/PurchasePaymentModal";
import type { PlanKey } from "@/lib/constants";
import type { LeadCtx } from "@/lib/sample-download";

type ModalKind =
  | "none"
  | "free-form"
  | "whatsapp-capture"
  | "download-auth"
  | "purchase"
  | "purchase-payment";

type ModalsContextValue = {
  kind: ModalKind;
  resultsOpen: boolean;
  leadCtx: LeadCtx | null;
  selectedPlan: PlanKey | null;
  sampleAvailable: boolean;
  openFreeForm: () => void;
  openFreeResults: (ctx?: LeadCtx) => void;
  closeResults: () => void;
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
  const [resultsOpen, setResultsOpen] = useState(false);
  const [leadCtx, setLeadCtxState] = useState<LeadCtx | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [sampleAvailable, setSampleAvailable] = useState(false);

  const close = useCallback(() => {
    setKind("none");
    setSampleAvailable(false);
    setSelectedPlan(null);
  }, []);

  const closeResults = useCallback(() => {
    setResultsOpen(false);
    setKind("none");
  }, []);

  const openFreeForm = useCallback(() => setKind("free-form"), []);

  const openFreeResults = useCallback((ctx?: LeadCtx) => {
    if (ctx) setLeadCtxState(ctx);
    setResultsOpen(true);
    setKind("none");
  }, []);

  const openWhatsAppCapture = useCallback((ctx: LeadCtx) => {
    setLeadCtxState(ctx);
    setKind("whatsapp-capture");
  }, []);

  const openDownloadAuth = useCallback((ctx: LeadCtx) => {
    setLeadCtxState(ctx);
    setKind("download-auth");
  }, []);

  const openPurchasePayment = useCallback((plan: PlanKey) => {
    setSelectedPlan(plan);
    setKind("purchase-payment");
  }, []);

  const openPurchase = useCallback(
    (opts?: { plan?: PlanKey; sampleAvailable?: boolean; ctx?: LeadCtx }) => {
      if (opts?.ctx) setLeadCtxState(opts.ctx);
      // FIX 1: Pro plan skips the Choose Your Plan modal — go straight to payment.
      if (opts?.plan === "pro") {
        setSelectedPlan("pro");
        setSampleAvailable(!!opts?.sampleAvailable);
        setKind("purchase-payment");
        return;
      }
      if (opts?.plan) setSelectedPlan(opts.plan);
      setSampleAvailable(!!opts?.sampleAvailable);
      setKind("purchase");
    },
    [],
  );

  const setLeadCtx = useCallback((ctx: LeadCtx) => setLeadCtxState(ctx), []);

  const value: ModalsContextValue = {
    kind,
    resultsOpen,
    leadCtx,
    selectedPlan,
    sampleAvailable,
    openFreeForm,
    openFreeResults,
    closeResults,
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

      {/* Free-results renders as its own fullscreen layer; stays mounted while sub-modals open on top */}
      {resultsOpen && (
        <Modal onClose={closeResults} variant="fullscreen" showClose={false}>
          <FreeResultsModalContent onClose={closeResults} />
        </Modal>
      )}

      {kind === "free-form" && (
        <Modal onClose={close}>
          <FreeFormModalContent />
        </Modal>
      )}

      {kind === "whatsapp-capture" && leadCtx && (
        <Modal onClose={close}>
          <WhatsAppCaptureModalContent onClose={close} {...leadCtx} />
        </Modal>
      )}

      {kind === "download-auth" && leadCtx && (
        <DownloadAuthModal onClose={close} {...leadCtx} />
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
        <PurchasePaymentModal plan={selectedPlan} onClose={close} />
      )}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  const ctx = useContext(ModalsContext);
  if (!ctx) throw new Error("useModals must be used within ModalsProvider");
  return ctx;
}
