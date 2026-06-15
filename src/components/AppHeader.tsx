import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, LogOut, User } from "lucide-react";

export function AppHeader({ name }: { name?: string | null }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = () => setOpen(false);
    if (open) {
      window.addEventListener("click", onClick);
      return () => window.removeEventListener("click", onClick);
    }
  }, [open]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-navy tracking-tight">Prep2Seat</Link>
        {name !== undefined && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-navy hover:opacity-80"
            >
              Hi {name?.split(" ")[0] || "there"}
              <ChevronDown size={16} />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-lg shadow-card overflow-hidden">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary"
                >
                  <User size={14} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-secondary"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
