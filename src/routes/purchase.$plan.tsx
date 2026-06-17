import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { Modal } from "@/components/Modal";
import { PurchaseModalContent } from "@/components/PurchaseModalContent";
import { type PlanKey } from "@/lib/constants";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase/$plan")({
  ssr: false,
  head: () => ({ meta: [{ title: "Complete your purchase — Prep2Seat" }] }),
  component: PurchaseRoute,
});

function PurchaseRoute() {
  const { plan } = Route.useParams();
  const navigate = useNavigate();
  const planKey = (plan === "pro" ? "pro" : "basic") as PlanKey;
  return (
    <>
      <LandingPage />
      <Modal onClose={() => navigate({ to: "/" })}>
        <PurchaseModalContent plan={planKey} onClose={() => navigate({ to: "/" })} />
      </Modal>
    </>
  );
}
