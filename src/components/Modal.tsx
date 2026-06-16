import { useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const close = () => {
    if (onClose) onClose();
    else navigate({ to: "/" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90vw] max-w-md bg-card rounded-2xl border border-border shadow-card-hover my-auto"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 hover:bg-secondary hover:text-navy transition"
        >
          <X size={20} />
        </button>
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
