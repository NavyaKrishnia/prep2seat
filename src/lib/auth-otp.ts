// OTP Authentication Flow
//
// PRIMARY (production): send-otp Edge Function generates code, stores hash
//   in phone_otps via service_role, sends via Twilio SMS. verify-otp checks hash.
//
// FALLBACK (when Edge Functions not deployed / Twilio not configured):
//   OTP generated in browser memory only — no DB write needed.
//   Code shown in UI. verifyOtpAndSignIn checks against in-memory store.
//   Uses Supabase anonymous sign-in for session.

import { supabase } from "@/integrations/supabase/client";

// In-memory OTP store — survives only for current browser session
// Map<canonicalPhone, { code, expiresAt }>
const memoryOtpStore = new Map<string, { code: string; expiresAt: number }>();

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+91${digits}`;
}

// ── Fallback: browser memory OTP, no DB required ────────────────────────────

async function sendOtpFallback(phone: string): Promise<string> {
  const canonical = normalizePhone(phone);
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  memoryOtpStore.set(canonical, { code, expiresAt });
  console.info("[OTP fallback] Code generated for", canonical);
  return code;
}

async function verifyOtpFallback(phone: string, code: string): Promise<void> {
  const canonical = normalizePhone(phone);
  const entry = memoryOtpStore.get(canonical);

  if (!entry) {
    throw new Error("No active OTP found. Please request a new code.");
  }
  if (Date.now() > entry.expiresAt) {
    memoryOtpStore.delete(canonical);
    throw new Error("OTP has expired. Please request a new code.");
  }
  if (entry.code !== code) {
    throw new Error("Incorrect OTP. Please try again.");
  }

  // OTP matched — consume it
  memoryOtpStore.delete(canonical);

  // Create a real Supabase session via anonymous sign-in
  const { error: signInErr } = await supabase.auth.signInAnonymously();
  if (signInErr) throw signInErr;

  // Tag the session with their phone number
  await supabase.auth.updateUser({
    data: { whatsapp_number: canonical, phone_verified: true },
  });
}

// ── Primary: Edge Function path ─────────────────────────────────────────────

async function sendOtpEdgeFunction(phone: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("send-otp", {
    body: { phone },
  });
  if (error) throw new Error(error.message || "Could not send OTP");
  if (data?.error) throw new Error(String(data.error));
}

async function verifyOtpEdgeFunction(phone: string, code: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("verify-otp", {
    body: { phone, code },
  });
  if (error) throw new Error(error.message || "Verification failed");
  if (!data || data.success !== true) {
    throw new Error(data?.error || "Verification failed");
  }
  const { email, token_hash } = data as { email: string; token_hash: string };
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    type: "email",
    email,
    token_hash,
  });
  if (verifyErr) throw verifyErr;
}

function isDeploymentError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("non-2xx") ||
    msg.includes("Failed to fetch") ||
    msg.includes("not found") ||
    msg.includes("503") ||
    msg.includes("not configured") ||
    msg.includes("FunctionsFetchError")
  );
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Send OTP.
 * Returns the plaintext code ONLY in fallback mode (shown in UI).
 * In production (Twilio working), returns undefined — code goes via SMS.
 */
export async function sendOtp(phone: string): Promise<string | undefined> {
  try {
    await sendOtpEdgeFunction(phone);
    // Edge function succeeded — real SMS sent, no code to return
    return undefined;
  } catch (err) {
    if (isDeploymentError(err)) {
      console.warn("[OTP] Edge Function unavailable, using in-memory fallback");
      return sendOtpFallback(phone);
    }
    throw err;
  }
}

/**
 * Verify OTP and sign user in.
 * Automatically uses same path as sendOtp did for this phone.
 */
export async function verifyOtpAndSignIn(
  phone: string,
  code: string,
): Promise<void> {
  const canonical = normalizePhone(phone);

  // If there's an in-memory entry for this phone, use fallback path
  if (memoryOtpStore.has(canonical)) {
    return verifyOtpFallback(phone, code);
  }

  // Otherwise try Edge Function path
  try {
    await verifyOtpEdgeFunction(phone, code);
  } catch (err) {
    if (isDeploymentError(err)) {
      console.warn("[OTP] Edge Function unavailable for verify");
      // No in-memory entry found either — user needs to resend
      throw new Error(
        "Session expired. Please click 'Resend OTP' to get a new code.",
      );
    }
    throw err;
  }
}
