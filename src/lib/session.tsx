import { createContext, useCallback, useContext, useEffect, useState } from "react";

type SessionState = {
  isVerified: boolean;
  whatsappNumber: string;
  sessionPlan: string;
};

type SessionContextValue = SessionState & {
  setVerified: (phone: string) => void;
  setSessionPlan: (plan: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "p2s_auth_session_v1";

const SessionContext = createContext<SessionContextValue | null>(null);

function readStored(): SessionState {
  if (typeof window === "undefined") {
    return { isVerified: false, whatsappNumber: "", sessionPlan: "" };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SessionState;
  } catch {
    /* ignore */
  }
  return { isVerified: false, whatsappNumber: "", sessionPlan: "" };
}

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    isVerified: false,
    whatsappNumber: "",
    sessionPlan: "",
  });

  // Hydrate from sessionStorage after mount (SSR-safe)
  useEffect(() => {
    setState(readStored());
  }, []);

  const persist = useCallback((next: SessionState) => {
    setState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const setVerified = useCallback(
    (phone: string) => {
      persist({ ...readStored(), isVerified: true, whatsappNumber: phone });
    },
    [persist],
  );

  const setSessionPlan = useCallback(
    (plan: string) => {
      persist({ ...readStored(), sessionPlan: plan });
    },
    [persist],
  );

  const clear = useCallback(() => {
    setState({ isVerified: false, whatsappNumber: "", sessionPlan: "" });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <SessionContext.Provider value={{ ...state, setVerified, setSessionPlan, clear }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useAuthSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useAuthSession must be used within AuthSessionProvider");
  return ctx;
}

/** Mask a 10-digit phone: 7612345678 -> 76XXXXX678 */
export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 5) return digits;
  const first = digits.slice(0, 2);
  const last = digits.slice(-3);
  const middle = "X".repeat(Math.max(0, digits.length - 5));
  return `${first}${middle}${last}`;
}
