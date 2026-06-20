import { useEffect } from "react";
import { X, ChevronLeft } from "lucide-react";

type Variant = "default" | "wide" | "fullscreen";

export function Modal({
  children,
  onClose,
  onBack,
  variant = "default",
  showClose = true,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
  variant?: Variant;
  showClose?: boolean;
}) {
  const close = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showClose) close();
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

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-[100] bg-background overflow-y-auto animate-in fade-in duration-200">
        {showClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="fixed top-4 right-4 z-[110] inline-flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-foreground/70 hover:bg-secondary hover:text-navy shadow-sm transition"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    );
  }

  const maxW = variant === "wide" ? "max-w-[680px]" : "max-w-md";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxW} bg-card rounded-2xl border border-border shadow-card-hover my-auto`}
      >
        {onBack && (
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="absolute top-3 left-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 hover:bg-secondary hover:text-navy transition"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {showClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 hover:bg-secondary hover:text-navy transition"
          >
            <X size={20} />
          </button>
        )}
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
