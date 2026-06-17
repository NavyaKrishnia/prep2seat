import { createContext, useCallback, useContext, useState } from "react";
import { Modal } from "@/components/Modal";
import { PurchaseModalContent } from "@/components/PurchaseModalContent";
import { SendWhatsAppModal } from "@/components/SendWhatsAppModal";
import { DownloadSampleModal } from "@/components/DownloadSampleModal";
import type { PlanKey } from "@/lib/constants";

type LeadCtx = { rank: number; state: string; category: string };

type ModalState =
  | { kind: "none" }
  | { kind: "purchase"; plan: PlanKey }
  | { kind: "send-whatsapp"; ctx: LeadCtx }
  | { kind: "download-sample"; ctx: LeadCtx };

type ModalsContextValue = {
  openPurchase: (plan: PlanKey) => void;
  openSendWhatsApp: (ctx: LeadCtx) => void;
  openDownloadSample: (ctx: LeadCtx) => void;
  close: () => void;
};

const ModalsContext = createContext<ModalsContextValue | null>(null);

export function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>({ kind: "none" });

  const close = useCallback(() => setState({ kind: "none" }), []);
  const openPurchase = useCallback(
    (plan: PlanKey) => setState({ kind: "purchase", plan }),
    [],
  );
  const openSendWhatsApp = useCallback(
    (ctx: LeadCtx) => setState({ kind: "send-whatsapp", ctx }),
    [],
  );
  const openDownloadSample = useCallback(
    (ctx: LeadCtx) => setState({ kind: "download-sample", ctx }),
    [],
  );

  return (
    <ModalsContext.Provider value={{ openPurchase, openSendWhatsApp, openDownloadSample, close }}>
      {children}
      {state.kind === "purchase" && (
        <Modal onClose={close}>
          <PurchaseModalContent plan={state.plan} onClose={close} />
        </Modal>
      )}
      {state.kind === "send-whatsapp" && (
        <SendWhatsAppModal onClose={close} {...state.ctx} />
      )}
      {state.kind === "download-sample" && (
        <DownloadSampleModal onClose={close} {...state.ctx} />
      )}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  const ctx = useContext(ModalsContext);
  if (!ctx) throw new Error("useModals must be used within ModalsProvider");
  return ctx;
}
